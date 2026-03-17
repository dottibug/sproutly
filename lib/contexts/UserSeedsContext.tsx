import { createContext, useReducer, useCallback, useMemo, useEffect, useContext } from 'react';
import { useAuth, Profile } from './AuthContext';
import { UserSeedItem, CatalogSeedItem } from '../types';
import { getUserSeedCollection, createUserSeedFromCatalog, createUserSeedFromCustom, isDuplicateSeed } from '../utils/userSeedUtils';
import { addCatalogSeedToUserCollection, addCustomSeedToUserCollection, deleteByCatalogId, deleteByCustomId } from '../queries';

// TODO: Handle errors

// UserSeedsContext.tsx follows the React context & reducer pattern to manage state for the user's seeds.
// Prefer this pattern to avoid deep prop drilling in React components.
// https://react.dev/learn/scaling-up-with-reducer-and-context

// ---- TYPES ----
type UserSeedsAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: UserSeedItem[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'ADD_SEED_FROM_CATALOG'; payload: CatalogSeedItem }
  | { type: 'ADD_CUSTOM_SEED'; payload: UserSeedItem }
  | { type: 'DELETE_SEED_BY_CATALOG_ID'; payload: UserSeedItem['catalog_seed_id'] }
  | { type: 'DELETE_SEED_BY_CUSTOM_ID'; payload: UserSeedItem['custom_seed_id'] };

// ---- INITIAL STATE SETUP ----
type UserSeedsState = {
  seeds: UserSeedItem[];
  loading: boolean;
  error: string | null;
};

const initialState: UserSeedsState = {
  seeds: [],
  loading: false,
  error: null,
};

// ---- REDUCER ----
function userSeedsReducer(state: UserSeedsState, action: UserSeedsAction): UserSeedsState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, seeds: action.payload, loading: false, error: null };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_SEED_FROM_CATALOG':
      return { ...state, seeds: [...state.seeds, createUserSeedFromCatalog(action.payload)] };
    case 'ADD_CUSTOM_SEED':
      return { ...state, seeds: [...state.seeds, action.payload] };
    case 'DELETE_SEED_BY_CATALOG_ID':
      return { ...state, seeds: state.seeds.filter((s) => s.catalog_seed_id !== action.payload) };
    case 'DELETE_SEED_BY_CUSTOM_ID':
      return { ...state, seeds: state.seeds.filter((s) => s.custom_seed_id !== action.payload) };
    default:
      return state;
  }
}

// ---- CONTEXT SETUP ----
type UserSeedsContextValue = {
  seeds: UserSeedItem[];
  loading: boolean;
  error: string | null;
  addSeedFromCatalog: (seed: CatalogSeedItem) => Promise<void>;
  addCustomSeed: (seed: UserSeedItem) => void;
  deleteSeedByCatalogId: (seed: UserSeedItem) => Promise<void>;
  deleteSeedByCustomId: (seed: UserSeedItem) => Promise<void>;
};

const UserSeedsContext = createContext<UserSeedsContextValue | null>(null);

// ---- PROVIDER (passes context to children) ----
type UserSeedsProviderProps = {
  readonly children: React.ReactNode;
};

export function UserSeedsProvider({ children }: UserSeedsProviderProps) {
  const [state, dispatch] = useReducer(userSeedsReducer, initialState);
  const { profile } = useAuth();

  const loadUserSeeds = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const collection = await getUserSeedCollection(profile as Profile);
      dispatch({ type: 'LOAD_SUCCESS', payload: collection ?? [] });
    } catch (error) {
      dispatch({ type: 'LOAD_ERROR', payload: error instanceof Error ? error.message : 'Failed to load user seed collection' });
    }
  }, [profile?.id]);

  // Load user seeds when component mounts and there is a profile
  useEffect(() => {
    // No profile means no user seeds to load
    if (!profile?.id) return;
    loadUserSeeds();
  }, [profile?.id, loadUserSeeds]);

  const addSeedFromCatalog = useCallback(
    async (catalogSeed: CatalogSeedItem) => {
      if (!profile?.id) return;
      if (isDuplicateSeed(state.seeds, catalogSeed.id)) return;

      // Add seed optimistically (doesn't block UI)
      dispatch({ type: 'ADD_SEED_FROM_CATALOG', payload: catalogSeed });

      try {
        const newSeed = await addCatalogSeedToUserCollection(profile.id, catalogSeed.id);
        console.log('✅ Seed added to collection from catalog:', newSeed);
      } catch (error) {
        dispatch({ type: 'DELETE_SEED_BY_CATALOG_ID', payload: catalogSeed.id });
        console.error('Error adding seed to collection:', error instanceof Error ? error.message : 'Unknown error');
      }
    },
    [profile?.id, state.seeds],
  );

  const addCustomSeed = useCallback((seed: UserSeedItem) => dispatch({ type: 'ADD_CUSTOM_SEED', payload: seed }), [state.seeds]);

  const deleteSeedByCatalogId = useCallback(
    async (seed: UserSeedItem) => {
      if (!profile?.id) return;

      // Remove seed optimistically
      dispatch({ type: 'DELETE_SEED_BY_CATALOG_ID', payload: seed.catalog_seed_id });

      try {
        await deleteByCatalogId(profile.id, seed.catalog_seed_id as string);
        console.log('✅ Seed removed from collection by catalog ID:');
      } catch (error) {
        dispatch({ type: 'ADD_SEED_FROM_CATALOG', payload: seed });
        console.error('Error removing seed from collection:', error instanceof Error ? error.message : 'Unknown error');
      }
    },
    [profile?.id, state.seeds],
  );

  const deleteSeedByCustomId = useCallback(
    async (seed: UserSeedItem) => {
      if (!profile?.id) return;

      // Remove seed optimistically
      dispatch({ type: 'DELETE_SEED_BY_CUSTOM_ID', payload: seed.custom_seed_id });

      // Update database
      try {
        await deleteByCustomId(profile.id, seed.custom_seed_id as string);
        console.log('✅ Seed removed from collection by custom ID:');
      } catch (error) {
        dispatch({ type: 'ADD_CUSTOM_SEED', payload: seed });
        console.error('Error removing seed from collection:', error instanceof Error ? error.message : 'Unknown error');
      }
    },
    [profile?.id, state.seeds],
  );

  const value = useMemo(
    () => ({
      seeds: state.seeds,
      loading: state.loading,
      error: state.error,
      addSeedFromCatalog,
      addCustomSeed,
      deleteSeedByCatalogId,
      deleteSeedByCustomId,
    }),
    [
      state.seeds,
      state.loading,
      state.error,
      addSeedFromCatalog,
      addCustomSeed,
      deleteSeedByCatalogId,
      deleteSeedByCustomId,
      loadUserSeeds,
    ],
  );

  return <UserSeedsContext.Provider value={value}>{children}</UserSeedsContext.Provider>;
}

// ---- CUSTOM HOOK (use in components to access the filter context) ----
export function useUserSeeds() {
  const context = useContext(UserSeedsContext);
  if (!context) throw new Error('useUserSeeds must be used within a UserSeedsProvider');
  return context;
}
