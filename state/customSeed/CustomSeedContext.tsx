import { createContext, useReducer, useCallback, useMemo, useContext } from 'react';
import { Category, Difficulty, Exposure } from '../userSeeds/seeds/seedInfoTypes';
import { CustomSeed } from './customSeedTypes';

// CustomSeedContext.tsx: Contains the context for the custom seed

// ---- TYPES ----
export type CustomSeedAction =
  | { type: 'SET_VARIETY'; payload: string }
  | { type: 'SET_CATEGORY'; payload: Category }
  | { type: 'SET_PLANT'; payload: string }
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
  | { type: 'SET_IMAGE_PATH'; payload: string | null }
  | { type: 'RESET_CUSTOM_SEED' };

// ---- INITIAL STATE SETUP ----
type CustomSeedState = {
  seed: CustomSeed;
};

const initialState: CustomSeedState = {
  seed: {
    id: '',
    variety: '',
    category: 'Vegetable',
    beanType: null,
    plant: '',
    latin: null,
    difficulty: 'Easy',
    exposure: 'Full sun',
    maturesInDays: null,
    maturesUnderDays: null,
    description: null,
    timing: null,
    starting: null,
    growing: null,
    harvest: null,
    companionPlanting: null,
    image: '',
  },
};

// ---- REDUCER ----
function customSeedReducer(state: CustomSeedState, action: CustomSeedAction): CustomSeedState {
  switch (action.type) {
    case 'SET_VARIETY':
      return { ...state, seed: { ...state.seed, variety: action.payload } };
    case 'SET_CATEGORY':
      return { ...state, seed: { ...state.seed, category: action.payload } };
    case 'SET_PLANT':
      return { ...state, seed: { ...state.seed, plant: action.payload } };
    case 'SET_BEAN_TYPE':
      return { ...state, seed: { ...state.seed, beanType: action.payload } };
    case 'SET_LATIN':
      return { ...state, seed: { ...state.seed, latin: action.payload } };
    case 'SET_DIFFICULTY':
      return { ...state, seed: { ...state.seed, difficulty: action.payload } };
    case 'SET_EXPOSURE':
      return { ...state, seed: { ...state.seed, exposure: action.payload } };
    case 'SET_MATURES_IN_DAYS':
      return { ...state, seed: { ...state.seed, maturesInDays: action.payload } };
    case 'SET_MATURES_UNDER_DAYS':
      return { ...state, seed: { ...state.seed, maturesUnderDays: action.payload } };
    case 'SET_DESCRIPTION':
      return { ...state, seed: { ...state.seed, description: action.payload } };
    case 'SET_TIMING':
      return { ...state, seed: { ...state.seed, timing: action.payload } };
    case 'SET_STARTING':
      return { ...state, seed: { ...state.seed, starting: action.payload } };
    case 'SET_GROWING':
      return { ...state, seed: { ...state.seed, growing: action.payload } };
    case 'SET_HARVEST':
      return { ...state, seed: { ...state.seed, harvest: action.payload } };
    case 'SET_COMPANION_PLANTING':
      return { ...state, seed: { ...state.seed, companionPlanting: action.payload } };
    case 'SET_IMAGE_PATH':
      return { ...state, seed: { ...state.seed, image: action.payload || '' } };
    case 'RESET_CUSTOM_SEED':
      return {
        ...initialState,
        seed: {
          ...initialState.seed,
          id: '',
          variety: '',
          category: 'Vegetable',
          beanType: null,
          plant: '',
          latin: null,
          difficulty: 'Easy',
          exposure: 'Full sun',
          maturesInDays: null,
          maturesUnderDays: null,
          description: null,
          timing: null,
          starting: null,
          growing: null,
          harvest: null,
          companionPlanting: null,
          image: '',
        },
      };
    default:
      return state;
  }
}

// ---- CONTEXT SETUP ----
type CustomSeedContextValue = CustomSeedState & {
  setVariety: (variety: string) => void;
  setCategory: (category: Category) => void;
  setPlant: (plant: string) => void;
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
  setImagePath: (imagePath: string | null) => void;
  resetCustomSeed: () => void;
};

const CustomSeedContext = createContext<CustomSeedContextValue | null>(null);

// ---- PROVIDER (passes context to children) ----
type CustomSeedProviderProps = { readonly children: React.ReactNode };

export function CustomSeedProvider({ children }: CustomSeedProviderProps) {
  const [state, dispatch] = useReducer(customSeedReducer, initialState);
  const setVariety = useCallback((variety: string) => dispatch({ type: 'SET_VARIETY', payload: variety }), []);
  const setCategory = useCallback((category: Category) => dispatch({ type: 'SET_CATEGORY', payload: category }), []);
  const setPlant = useCallback((plant: string) => dispatch({ type: 'SET_PLANT', payload: plant }), []);
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
    if (!state.seed.maturesInDays) dispatch({ type: 'SET_MATURES_UNDER_DAYS', payload: null });
    else {
      // Nearest 10 days to the matures in days
      const underDays = Math.ceil(state.seed.maturesInDays / 10) * 10;
      dispatch({ type: 'SET_MATURES_UNDER_DAYS', payload: underDays });
    }
  }, [state.seed.maturesInDays]);

  const setDescription = useCallback((description: string | null) => dispatch({ type: 'SET_DESCRIPTION', payload: description }), []);

  const setTiming = useCallback((timing: string | null) => dispatch({ type: 'SET_TIMING', payload: timing }), []);
  const setStarting = useCallback((starting: string | null) => dispatch({ type: 'SET_STARTING', payload: starting }), []);
  const setGrowing = useCallback((growing: string | null) => dispatch({ type: 'SET_GROWING', payload: growing }), []);
  const setHarvest = useCallback((harvest: string | null) => dispatch({ type: 'SET_HARVEST', payload: harvest }), []);

  const setCompanionPlanting = useCallback(
    (companionPlanting: string | null) => dispatch({ type: 'SET_COMPANION_PLANTING', payload: companionPlanting }),
    [],
  );

  const setImagePath = useCallback((image: string | null) => dispatch({ type: 'SET_IMAGE_PATH', payload: image }), []);

  const resetCustomSeed = useCallback(() => dispatch({ type: 'RESET_CUSTOM_SEED' }), []);

  const value = useMemo(
    () => ({
      ...state,
      setVariety,
      setCategory,
      setPlant,
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
      setImagePath,
      resetCustomSeed,
    }),
    [
      state,
      setVariety,
      setCategory,
      setPlant,
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
      setImagePath,
      resetCustomSeed,
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
