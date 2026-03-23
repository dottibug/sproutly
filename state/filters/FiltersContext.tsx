import { createContext, useReducer, useEffect, useCallback, useMemo, useContext } from 'react';
import { useAuth } from '../app/AuthContext';
import { SearchFilter, OpenFilters, SelectedFilters, UserFilterPreferences, SEARCH_FILTER_NAMES, DEFAULT_OPEN } from './filterTypes';
import { getOpenFilters, getUserFilterPreferences, updateUserFilterPreferences } from './filterUtils';

// ---- TYPES ----
export type FilterAction =
  | { type: 'SET_SELECTED'; payload: { filter: SearchFilter; value: string[] } }
  | { type: 'CLEAR_SELECTED'; payload: SearchFilter }
  | { type: 'CLEAR_ALL_SELECTED' }
  | { type: 'SET_OPEN_FILTERS'; payload: { filter: SearchFilter; open: boolean } }
  | { type: 'OPEN_FILTERS'; payload: OpenFilters }
  | { type: 'SET_FILTER_PREFERENCES'; payload: UserFilterPreferences }
  | { type: 'LOAD_FILTER_PREFERENCES'; payload: UserFilterPreferences }
  | { type: 'SAVE_FILTER_PREFERENCES'; payload: UserFilterPreferences }
  | { type: 'RESET_FILTER_PREFERENCES' };

// ---- INITIAL STATE SETUP ----
type FilterState = {
  preferences: UserFilterPreferences;
  openFilters: OpenFilters;
  selected: SelectedFilters;
};

const initialPreferences: UserFilterPreferences = {
  order: SEARCH_FILTER_NAMES,
  openByDefault: DEFAULT_OPEN,
};

const initialSelected: SelectedFilters = {
  category: [],
  starting: [],
  exposure: [],
  season: [],
  month: [],
  readyToHarvest: [],
  difficulty: [],
};

const initialState: FilterState = {
  preferences: initialPreferences,
  openFilters: getOpenFilters(initialSelected, initialPreferences),
  selected: initialSelected,
};

// ---- REDUCER ----
function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_SELECTED':
      return setSelectedHelper(state, action);
    case 'CLEAR_SELECTED':
      return clearSelectedHelper(state, action);
    case 'CLEAR_ALL_SELECTED':
      return clearAllSelectedHelper(state, action);
    case 'SET_OPEN_FILTERS':
      return setOpenFiltersHelper(state, action);
    case 'OPEN_FILTERS':
      return openFiltersHelper(state, action);
    case 'SET_FILTER_PREFERENCES':
      return setFilterPreferencesHelper(state, action);
    case 'LOAD_FILTER_PREFERENCES':
      return loadFilterPreferencesHelper(state, action);
    case 'SAVE_FILTER_PREFERENCES':
      return saveFilterPreferencesHelper(state, action);
    case 'RESET_FILTER_PREFERENCES':
      return resetFilterPreferencesHelper(state, action);
    default:
      return state;
  }
}

// ---- CONTEXT SETUP ----
type FilterContextValue = FilterState & {
  setSelected: (filter: SearchFilter, value: string[]) => void;
  clearSelected: (filter: SearchFilter) => void;
  clearAllSelected: () => void;
  setOpenFilters: (filter: SearchFilter, open: boolean) => void;
  applyOpenFilters: () => void;
  setFilterPreferences: (prefs: UserFilterPreferences) => void;
  loadFilterPreferences: () => Promise<void>;
  saveFilterPreferences: () => Promise<void>;
  resetFilterPreferences: () => void;
};

const FilterContext = createContext<FilterContextValue | null>(null);

// ---- PROVIDER (passes context to children) ----
type FilterProviderProps = { readonly children: React.ReactNode };

export function FilterProvider({ children }: FilterProviderProps) {
  const [state, dispatch] = useReducer(filterReducer, initialState);
  const { profile } = useAuth();

  const loadFilterPreferences = useCallback(async () => {
    const prefs = await getUserFilterPreferences(profile?.id as string);
    if (!prefs) return;
    dispatch({
      type: 'LOAD_FILTER_PREFERENCES',
      payload: prefs,
    });
  }, [profile?.id]);

  useEffect(() => {
    if (profile?.id) loadFilterPreferences();
  }, [profile?.id, loadFilterPreferences]);

  const setSelected = useCallback(
    (filter: SearchFilter, value: SelectedFilters[SearchFilter]) => dispatch({ type: 'SET_SELECTED', payload: { filter, value } }),
    [],
  );

  const clearSelected = useCallback((filter: SearchFilter) => dispatch({ type: 'CLEAR_SELECTED', payload: filter }), []);
  const clearAllSelected = useCallback(() => dispatch({ type: 'CLEAR_ALL_SELECTED' }), []);

  const setOpenFilters = useCallback(
    (filter: SearchFilter, open: boolean) => dispatch({ type: 'SET_OPEN_FILTERS', payload: { filter, open } }),
    [],
  );

  const applyOpenFilters = useCallback(
    () => dispatch({ type: 'OPEN_FILTERS', payload: getOpenFilters(state.selected, state.preferences) }),
    [state.selected, state.preferences],
  );

  const setFilterPreferences = useCallback(
    (prefs: UserFilterPreferences) => dispatch({ type: 'SET_FILTER_PREFERENCES', payload: prefs }),
    [],
  );

  const saveFilterPreferences = useCallback(async () => {
    await updateUserFilterPreferences(profile?.id as string, state.preferences);
  }, [profile?.id, state.preferences]);

  const resetFilterPreferences = useCallback(() => dispatch({ type: 'RESET_FILTER_PREFERENCES' }), []);

  const value = useMemo(
    () => ({
      ...state,
      setSelected,
      clearSelected,
      clearAllSelected,
      setOpenFilters,
      applyOpenFilters,
      setFilterPreferences,
      loadFilterPreferences,
      saveFilterPreferences,
      resetFilterPreferences,
    }),
    [
      state,
      setSelected,
      clearSelected,
      clearAllSelected,
      setOpenFilters,
      applyOpenFilters,
      setFilterPreferences,
      loadFilterPreferences,
      saveFilterPreferences,
      resetFilterPreferences,
    ],
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

// ---- CUSTOM HOOK (use in components to access the filter context) ----
export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) throw new Error('useFilters must be used within a FilterProvider');
  return context;
}

// ---- REDUCER HELPER FUNCTIONS ----
const setSelectedHelper = (state: FilterState, action: FilterAction & { type: 'SET_SELECTED' }) => {
  const { filter, value } = action.payload;
  return {
    ...state,
    selected: { ...state.selected, [filter]: value },
  };
};

const clearSelectedHelper = (state: FilterState, action: FilterAction & { type: 'CLEAR_SELECTED' }) => {
  const filter = action.payload;
  return {
    ...state,
    selected: { ...state.selected, [filter]: [] },
  };
};

const clearAllSelectedHelper = (state: FilterState, action: FilterAction & { type: 'CLEAR_ALL_SELECTED' }) => {
  return { ...state, selected: initialSelected };
};

const setOpenFiltersHelper = (state: FilterState, action: FilterAction & { type: 'SET_OPEN_FILTERS' }) => {
  const { filter, open } = action.payload;
  return {
    ...state,
    openFilters: { ...state.openFilters, [filter]: open },
  };
};

const openFiltersHelper = (state: FilterState, action: FilterAction & { type: 'OPEN_FILTERS' }) => {
  return { ...state, openFilters: action.payload };
};

const setFilterPreferencesHelper = (state: FilterState, action: FilterAction & { type: 'SET_FILTER_PREFERENCES' }) => {
  return { ...state, preferences: action.payload };
};

const loadFilterPreferencesHelper = (state: FilterState, action: FilterAction & { type: 'LOAD_FILTER_PREFERENCES' }) => {
  return {
    ...state,
    preferences: action.payload,
    openFilters: getOpenFilters(state.selected, action.payload),
  };
};

const saveFilterPreferencesHelper = (state: FilterState, action: FilterAction & { type: 'SAVE_FILTER_PREFERENCES' }) => {
  return { ...state, preferences: action.payload };
};

const resetFilterPreferencesHelper = (state: FilterState, action: FilterAction & { type: 'RESET_FILTER_PREFERENCES' }) => {
  return {
    ...state,
    preferences: initialPreferences,
    openFilters: getOpenFilters(initialSelected, initialPreferences),
    selected: initialSelected,
  };
};
