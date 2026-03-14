import { createContext, useReducer, useCallback, useMemo, useContext } from 'react';
import { useAuth } from './AuthContext';
import { SeedType, Difficulty, Exposure, Planting } from '../types';

// ---- TYPES ----
export type CustomSeedAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_TYPE'; payload: SeedType }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_BEAN_TYPE'; payload: 'Broad' | 'Bush' | 'Pole' | null }
  | { type: 'SET_LATIN'; payload: string | null }
  | { type: 'SET_DIFFICULTY'; payload: Difficulty | null }
  | { type: 'SET_EXPOSURE'; payload: Exposure | null }
  | { type: 'SET_MATURES_IN_DAYS'; payload: number | null }
  | { type: 'SET_MATURES_UNDER_DAYS'; payload: number | null }
  | { type: 'SET_DESCRIPTION'; payload: string | null }
  | { type: 'SET_TIMING'; payload: string | null }
  | { type: 'SET_STARTING'; payload: string | null }
  | { type: 'SET_GROWING'; payload: string | null }
  | { type: 'SET_HARVEST'; payload: string | null }
  | { type: 'SET_COMPANION_PLANTING'; payload: string | null }
  | { type: 'SET_IMAGE'; payload: string | null }
  | { type: 'SET_PLANTING'; payload: Planting[] | null };

// ---- INITIAL STATE SETUP ----
type CustomSeedState = {
  name: string;
  type: SeedType;
  category: string;
  beanType: 'Broad' | 'Bush' | 'Pole' | null;
  latin: string | null;
  difficulty: Difficulty | null;
  exposure: Exposure | null;
  maturesInDays: number | null;
  maturesUnderDays: number | null;
  description: string | null;
  timing: string | null;
  starting: string | null;
  growing: string | null;
  harvest: string | null;
  companionPlanting: string | null;
  image: string | null;
  planting: Planting[] | null;
};

const initialState: CustomSeedState = {
  name: '',
  type: 'Vegetable',
  category: '',
  beanType: null,
  latin: null,
  difficulty: null,
  exposure: null,
  maturesInDays: null,
  maturesUnderDays: null,
  description: null,
  timing: null,
  starting: null,
  growing: null,
  harvest: null,
  companionPlanting: null,
  image: null,
  planting: null,
};

// ---- REDUCER ----
function customSeedReducer(state: CustomSeedState, action: CustomSeedAction): CustomSeedState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_TYPE':
      return { ...state, type: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_BEAN_TYPE':
      return { ...state, beanType: action.payload };
    case 'SET_LATIN':
      return { ...state, latin: action.payload };
    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload };
    case 'SET_EXPOSURE':
      return { ...state, exposure: action.payload };
    case 'SET_MATURES_IN_DAYS':
      return { ...state, maturesInDays: action.payload };
    case 'SET_MATURES_UNDER_DAYS':
      return { ...state, maturesUnderDays: action.payload };
    case 'SET_DESCRIPTION':
      return { ...state, description: action.payload };
    case 'SET_TIMING':
      return { ...state, timing: action.payload };
    case 'SET_STARTING':
      return { ...state, starting: action.payload };
    case 'SET_GROWING':
      return { ...state, growing: action.payload };
    case 'SET_HARVEST':
      return { ...state, harvest: action.payload };
    case 'SET_COMPANION_PLANTING':
      return { ...state, companionPlanting: action.payload };
    case 'SET_IMAGE':
      return { ...state, image: action.payload };
    case 'SET_PLANTING':
      return { ...state, planting: action.payload };
    default:
      return state;
  }
}

// ---- CONTEXT SETUP ----
type CustomSeedContextValue = CustomSeedState & {
  setName: (name: string) => void;
  setType: (type: SeedType) => void;
  setCategory: (category: string) => void;
  setBeanType: (beanType: 'Broad' | 'Bush' | 'Pole' | null) => void;
  setLatin: (latin: string | null) => void;
  setDifficulty: (difficulty: Difficulty | null) => void;
  setExposure: (exposure: Exposure | null) => void;
  setMaturesInDays: (maturesInDays: number | null) => void;
  setMaturesUnderDays: () => void;
  setDescription: (description: string | null) => void;
  setTiming: (timing: string | null) => void;
  setStarting: (starting: string | null) => void;
  setGrowing: (growing: string | null) => void;
  setHarvest: (harvest: string | null) => void;
  setCompanionPlanting: (companionPlanting: string | null) => void;
  setImage: (image: string | null) => void;
  setPlanting: (planting: Planting[] | null) => void;
};

const CustomSeedContext = createContext<CustomSeedContextValue | null>(null);

// ---- PROVIDER (passes context to children) ----
type CustomSeedProviderProps = { readonly children: React.ReactNode };

export function CustomSeedProvider({ children }: CustomSeedProviderProps) {
  const [state, dispatch] = useReducer(customSeedReducer, initialState);

  const profile = useAuth();

  const setName = useCallback((name: string) => dispatch({ type: 'SET_NAME', payload: name }), []);

  const setType = useCallback((type: SeedType) => dispatch({ type: 'SET_TYPE', payload: type }), []);

  const setCategory = useCallback((category: string) => dispatch({ type: 'SET_CATEGORY', payload: category }), []);

  const setBeanType = useCallback(
    (beanType: 'Broad' | 'Bush' | 'Pole' | null) => dispatch({ type: 'SET_BEAN_TYPE', payload: beanType }),
    [],
  );

  const setLatin = useCallback((latin: string | null) => dispatch({ type: 'SET_LATIN', payload: latin }), []);

  const setDifficulty = useCallback((difficulty: Difficulty | null) => dispatch({ type: 'SET_DIFFICULTY', payload: difficulty }), []);

  const setExposure = useCallback((exposure: Exposure | null) => dispatch({ type: 'SET_EXPOSURE', payload: exposure }), []);

  const setMaturesInDays = useCallback(
    (maturesInDays: number | null) => dispatch({ type: 'SET_MATURES_IN_DAYS', payload: maturesInDays }),
    [],
  );

  const setMaturesUnderDays = useCallback(() => {
    if (!state.maturesInDays) dispatch({ type: 'SET_MATURES_UNDER_DAYS', payload: null });
    else {
      // Nearest 10 days to the matures in days
      const underDays = Math.ceil(state.maturesInDays / 10) * 10;
      dispatch({ type: 'SET_MATURES_UNDER_DAYS', payload: underDays });
    }
  }, [state.maturesInDays]);

  const setDescription = useCallback((description: string | null) => dispatch({ type: 'SET_DESCRIPTION', payload: description }), []);

  const setTiming = useCallback((timing: string | null) => dispatch({ type: 'SET_TIMING', payload: timing }), []);

  const setStarting = useCallback((starting: string | null) => dispatch({ type: 'SET_STARTING', payload: starting }), []);

  const setGrowing = useCallback((growing: string | null) => dispatch({ type: 'SET_GROWING', payload: growing }), []);

  const setHarvest = useCallback((harvest: string | null) => dispatch({ type: 'SET_HARVEST', payload: harvest }), []);

  const setCompanionPlanting = useCallback(
    (companionPlanting: string | null) => dispatch({ type: 'SET_COMPANION_PLANTING', payload: companionPlanting }),
    [],
  );

  const setImage = useCallback((image: string | null) => dispatch({ type: 'SET_IMAGE', payload: image }), []);

  const setPlanting = useCallback((planting: Planting[] | null) => dispatch({ type: 'SET_PLANTING', payload: planting }), []);

  const value = useMemo(
    () => ({
      ...state,
      setName,
      setType,
      setCategory,
      setBeanType,
      setLatin,
      setDifficulty,
      setExposure,
      setMaturesInDays,
      setMaturesUnderDays,
      setDescription,
      setTiming,
      setStarting,
      setGrowing,
      setHarvest,
      setCompanionPlanting,
      setImage,
      setPlanting,
    }),
    [
      state,
      setName,
      setType,
      setCategory,
      setBeanType,
      setLatin,
      setDifficulty,
      setExposure,
      setMaturesInDays,
      setMaturesUnderDays,
      setDescription,
      setTiming,
      setStarting,
      setGrowing,
      setHarvest,
      setCompanionPlanting,
      setImage,
      setPlanting,
    ],
  );

  return <CustomSeedContext.Provider value={value}>{children}</CustomSeedContext.Provider>;
}

// ---- CUSTOM HOOK (use in components to access the filter context) ----
export function useCustomSeed() {
  const context = useContext(CustomSeedContext);
  if (!context) throw new Error('useCustomSeed must be used within a CustomSeedProvider');
  return context;
}
