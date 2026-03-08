import { createContext, useReducer, useEffect, useCallback, useMemo, useContext } from 'react';
import { Profile, useAuth } from './AuthContext';
import { supabase } from '../supabase';
import { PlantingAction, SeedType, UserSeedItem } from '../seedCatalog';

// ---- CONSTANTS ----
export const PLANT_TYPES: SeedType[] = ['Vegetable', 'Flower', 'Fruit', 'Herb'];
export const STARTING = ['Start indoors', 'Direct sow'];
export const EXPOSURE = ['Full sun', 'Full sun to part shade', 'Part shade'];
export const SEASON = ['Winter', 'Spring', 'Summer', 'Fall'];
export const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const READY_TO_HARVEST = ['Under 50 days', '50 to 70 days', '80 to 100 days', '110 to 130 days', 'Over 130 days'];
export const DIFFICULTY = ['Easy', 'Standard', 'Intermediate', 'Advanced', 'Expert'];

export const MONTH_MAP: Record<string, number> = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};
export type Filter = 'plantType' | 'starting' | 'exposure' | 'season' | 'month' | 'readyToHarvest' | 'difficulty';

export const FILTERS: Filter[] = ['plantType', 'starting', 'exposure', 'season', 'month', 'readyToHarvest', 'difficulty'];

// ---- INITIAL STATE SETUP ----
type FilterState = {
  preferences: UserFilterPreferences;
  expanded: ExpandedFilters;
  selected: SelectedFilters;
};

const DEFAULT_EXPANDED: Filter[] = ['plantType', 'starting'];
const DEFAULT_ORDER: Filter[] = ['plantType', 'starting', 'exposure', 'season', 'month', 'readyToHarvest', 'difficulty'];

const initialPreferences: UserFilterPreferences = {
  order: DEFAULT_ORDER,
  expandedByDefault: DEFAULT_EXPANDED,
};

const initialSelected: SelectedFilters = {
  plantType: [],
  starting: [],
  exposure: [],
  season: [],
  month: [],
  readyToHarvest: [],
  difficulty: [],
};

const initialState: FilterState = {
  preferences: initialPreferences,
  expanded: getExpandedFilters(initialSelected, initialPreferences),
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
    case 'SET_EXPANDED':
      return setExpandedHelper(state, action);
    case 'EXPAND_ON_OPEN':
      return expandOnOpenHelper(state, action);
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
  setSelected: (filter: Filter, value: string[]) => void;
  clearSelected: (filter: Filter) => void;
  clearAllSelected: () => void;
  setExpanded: (filter: Filter, open: boolean) => void;
  expandOnOpen: () => void;
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
    const prefs = await getUserFilterPreferences(profile as Profile);
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
    (filter: Filter, value: SelectedFilters[Filter]) => dispatch({ type: 'SET_SELECTED', payload: { filter, value } }),
    [],
  );

  const clearSelected = useCallback((filter: Filter) => dispatch({ type: 'CLEAR_SELECTED', payload: filter }), []);

  const clearAllSelected = useCallback(() => dispatch({ type: 'CLEAR_ALL_SELECTED' }), []);

  const setExpanded = useCallback((filter: Filter, open: boolean) => dispatch({ type: 'SET_EXPANDED', payload: { filter, open } }), []);

  const expandOnOpen = useCallback(
    () => dispatch({ type: 'EXPAND_ON_OPEN', payload: getExpandedFilters(state.selected, state.preferences) }),
    [state.selected, state.preferences],
  );

  const setFilterPreferences = useCallback(
    (prefs: UserFilterPreferences) => dispatch({ type: 'SET_FILTER_PREFERENCES', payload: prefs }),
    [],
  );

  const saveFilterPreferences = useCallback(async () => {
    await updateUserFilterPreferences(profile as Profile, state.preferences);
  }, [profile?.id, state.preferences]);

  const resetFilterPreferences = useCallback(() => dispatch({ type: 'RESET_FILTER_PREFERENCES' }), []);

  const value = useMemo(
    () => ({
      ...state,
      setSelected,
      clearSelected,
      clearAllSelected,
      setExpanded,
      expandOnOpen,
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
      setExpanded,
      expandOnOpen,
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

const setExpandedHelper = (state: FilterState, action: FilterAction & { type: 'SET_EXPANDED' }) => {
  const { filter, open } = action.payload;
  return {
    ...state,
    expanded: { ...state.expanded, [filter]: open },
  };
};

const expandOnOpenHelper = (state: FilterState, action: FilterAction & { type: 'EXPAND_ON_OPEN' }) => {
  return { ...state, expanded: action.payload };
};

const setFilterPreferencesHelper = (state: FilterState, action: FilterAction & { type: 'SET_FILTER_PREFERENCES' }) => {
  return { ...state, preferences: action.payload };
};

const loadFilterPreferencesHelper = (state: FilterState, action: FilterAction & { type: 'LOAD_FILTER_PREFERENCES' }) => {
  return {
    ...state,
    preferences: action.payload,
    expanded: getExpandedFilters(state.selected, action.payload),
  };
};

const saveFilterPreferencesHelper = (state: FilterState, action: FilterAction & { type: 'SAVE_FILTER_PREFERENCES' }) => {
  return { ...state, preferences: action.payload };
};

const resetFilterPreferencesHelper = (state: FilterState, action: FilterAction & { type: 'RESET_FILTER_PREFERENCES' }) => {
  return {
    ...state,
    preferences: initialPreferences,
    expanded: getExpandedFilters(initialSelected, initialPreferences),
    selected: initialSelected,
  };
};

// ---- PROVIDER HELPER FUNCTIONS ----
async function getUserFilterPreferences(profile: Profile) {
  if (!profile?.id) return;

  const { data, error } = await supabase.from('profiles').select('filter_order, filter_expanded_by_default').eq('id', profile.id).single();

  if (error || !data) return;

  const order = (data.filter_order as Filter[]) ?? DEFAULT_ORDER;
  const expandedByDefault = (data.filter_expanded_by_default as Filter[]) ?? DEFAULT_EXPANDED;

  return { order, expandedByDefault };
}

async function updateUserFilterPreferences(profile: Profile, preferences: UserFilterPreferences) {
  if (!profile?.id) return;
  const { order, expandedByDefault } = preferences;

  const { error } = await supabase
    .from('profiles')
    .update({
      filter_order: order,
      filter_expanded_by_default: expandedByDefault,
    })
    .eq('id', profile.id);

  if (error) throw error;
  return preferences;
}

// ---- FILTERING FUNCTIONS ----
/* Determine which filter sections are expanded when the 'Filters' accordion is opened
 - expand sections that have at least one filter selected
 - expand sections that are in FilterPreferences.expandedByDefault
 */
export function getExpandedFilters(selected: SelectedFilters, preferences: UserFilterPreferences): ExpandedFilters {
  const expanded: ExpandedFilters = {};
  for (const filter of FILTERS) {
    expanded[filter] = selected[filter].length > 0 || preferences.expandedByDefault.includes(filter);
  }
  return expanded;
}

// Apply filters to a list of seeds
export function applyFilters(seeds: UserSeedItem[], selectedFilters: SelectedFilters) {
  let list = seeds;

  for (const filter of FILTERS) {
    const selected = selectedFilters[filter];
    if (selected.length === 0) continue; // No filters selected in this section

    list = list.filter((seed) => {
      switch (filter) {
        case 'plantType':
          return selected.includes(seed.type);
        case 'starting':
          return filterByStarting(seed, selected);
        case 'exposure':
          return seed?.exposure && selected.includes(seed.exposure);
        case 'difficulty':
          return seed?.difficulty && selected.includes(seed.difficulty);
        case 'season':
          return seed.planting.some((p) => p.seasons.some((s) => selected.includes(s)));
        case 'month':
          return filterByMonth(seed, selected);
        case 'readyToHarvest':
          return filterByReadyToHarvest(seed, selected);
        default:
          return true;
      }
    });
  }
  return list;
}

function filterByStarting(seed: UserSeedItem, selected: string[]) {
  // Get the planting actions for the seed
  const seedActions = new Set(seed.planting.map((p) => p.action));
  // Check if the selected actions include any of the seed's planting actions
  return selected.some((s) => {
    const action = s.toLowerCase().replace(' ', '_') as PlantingAction;
    return seedActions.has(action);
  });
}

function filterByMonth(seed: UserSeedItem, selected: string[]) {
  // Get the planting months for the seed (as array of numbers)
  const seedMonths = seed.planting.map((p) => p.months);
  // Check if the selected months include any of the seed's planting months
  return selected.some((s) => {
    const month = MONTH_MAP[s];
    return seedMonths.some((m) => m.includes(month));
  });
}

function filterByReadyToHarvest(seed: UserSeedItem, selected: string[]) {
  const days = seed.matures_under_days;
  if (days === null) return false;
  return selected.some((s) => {
    const readyToHarvestLabel = String(s);
    if (readyToHarvestLabel === 'Under 50 days') return days < 50;
    if (readyToHarvestLabel === '50 to 70 days') return days >= 50 && days <= 70;
    if (readyToHarvestLabel === '80 to 100 days') return days >= 80 && days <= 100;
    if (readyToHarvestLabel === '110 to 130 days') return days >= 110 && days <= 130;
    if (readyToHarvestLabel === 'Over 130 days') return days > 130;
    return false;
  });
}

// ---- TYPES ----
export type SelectedFilters = Record<Filter, string[]>;
export type ExpandedFilters = Partial<Record<Filter, boolean>>;

export type UserFilterPreferences = {
  order: Filter[];
  expandedByDefault: Filter[];
};

export type FilterAction =
  | { type: 'SET_SELECTED'; payload: { filter: Filter; value: string[] } }
  | { type: 'CLEAR_SELECTED'; payload: Filter }
  | { type: 'CLEAR_ALL_SELECTED' }
  | { type: 'SET_EXPANDED'; payload: { filter: Filter; open: boolean } }
  | { type: 'EXPAND_ON_OPEN'; payload: ExpandedFilters }
  | { type: 'SET_FILTER_PREFERENCES'; payload: UserFilterPreferences }
  | { type: 'LOAD_FILTER_PREFERENCES'; payload: UserFilterPreferences }
  | { type: 'SAVE_FILTER_PREFERENCES'; payload: UserFilterPreferences }
  | { type: 'RESET_FILTER_PREFERENCES' };
