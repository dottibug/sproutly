import { createContext, useReducer, useCallback, useMemo, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../supabase';
import { fetchPlantingActions, type UserSeedItem, type CatalogSeedItem, getCategoryPlantingActions } from '../seedCatalog';
import { createUserSeedFromCatalog, createUserSeedFromCustom, createUserSeedFromDatabase } from '../contexts/databaseUtils';

// UserSeedsContext.tsx follows the React context & reducer pattern to manage state for the user's seeds.
// Prefer this pattern to avoid deep prop drilling in React components.
// https://react.dev/learn/scaling-up-with-reducer-and-context

// State type
type UserSeedsState = {
  seeds: UserSeedItem[];
  loading: boolean;
  error: string | null;
};

// Actions
const LOAD_START = 'LOAD_START';
const LOAD_SUCCESS = 'LOAD_SUCCESS';
const LOAD_ERROR = 'LOAD_ERROR';
const ADD_SEED_FROM_CATALOG = 'ADD_SEED_FROM_CATALOG';
const ADD_CUSTOM_SEED = 'ADD_CUSTOM_SEED';
const DELETE_SEED_BY_CATALOG_ID = 'DELETE_SEED_BY_CATALOG_ID';
const DELETE_SEED_BY_CUSTOM_ID = 'DELETE_SEED_BY_CUSTOM_ID';
const REFRESH = 'REFRESH';

// Action types
type UserSeedsAction =
  | { type: typeof LOAD_START }
  | { type: typeof LOAD_SUCCESS; payload: UserSeedItem[] }
  | { type: typeof LOAD_ERROR; payload: string }
  | { type: typeof ADD_SEED_FROM_CATALOG; payload: CatalogSeedItem }
  | { type: typeof ADD_CUSTOM_SEED; payload: UserSeedItem }
  | { type: typeof DELETE_SEED_BY_CATALOG_ID; payload: UserSeedItem['catalog_seed_id'] }
  | { type: typeof DELETE_SEED_BY_CUSTOM_ID; payload: UserSeedItem['custom_seed_id'] }
  | { type: typeof REFRESH; payload: UserSeedItem[] };

// Initial state
const initialState: UserSeedsState = {
  seeds: [],
  loading: false,
  error: null,
};

// Reducer function to update the state based on action
function userSeedsReducer(state: UserSeedsState, action: UserSeedsAction): UserSeedsState {
  switch (action.type) {
    case LOAD_START:
      return { ...state, loading: true, error: null };
    case LOAD_SUCCESS:
      return { ...state, seeds: action.payload, loading: false, error: null };
    case LOAD_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ADD_SEED_FROM_CATALOG:
      return { ...state, seeds: [...state.seeds, createUserSeedFromCatalog(action.payload)] };
    case ADD_CUSTOM_SEED:
      return { ...state, seeds: [...state.seeds, createUserSeedFromCustom(action.payload)] };
    case DELETE_SEED_BY_CATALOG_ID:
      return { ...state, seeds: state.seeds.filter((s) => s.catalog_seed_id !== action.payload) };
    case DELETE_SEED_BY_CUSTOM_ID:
      return { ...state, seeds: state.seeds.filter((s) => s.custom_seed_id !== action.payload) };
    case REFRESH:
      return { ...state, seeds: action.payload };
    default:
      return state;
  }
}

// Context value types
type UserSeedsContextValue = {
  seeds: UserSeedItem[];
  loading: boolean;
  error: string | null;
  addSeedFromCatalog: (seed: CatalogSeedItem) => Promise<void>;
  addCustomSeed: (seed: UserSeedItem) => Promise<void>;
  deleteSeedByCatalogId: (seed: UserSeedItem) => Promise<void>;
  deleteSeedByCustomId: (seed: UserSeedItem) => Promise<void>;
  refresh: () => Promise<void>;
};

const UserSeedsContext = createContext<UserSeedsContextValue | null>(null);

// Provider props type
type UserSeedsProviderProps = {
  readonly children: React.ReactNode;
};

// Provider component to wrap the app (provides context values to all child components)
export function UserSeedsProvider({ children }: UserSeedsProviderProps) {
  const [state, dispatch] = useReducer(userSeedsReducer, initialState);
  const { profile } = useAuth();

  // Fetch user seeds from database (stable ref so useEffect doesn't loop)
  const loadUserSeeds = useCallback(async () => {
    dispatch({ type: LOAD_START });

    try {
      const [collection, plantingActions] = await Promise.all([
        supabase
          .from('user_seed_collection')
          .select(
            `id,catalog_seed_id,custom_seed_id,notes,
          seed_catalog (id, name, sku, type, bean_type, category, latin, difficulty, exposure, matures_in_days, matures_under_days, description, timing, starting, growing, harvest, companion_planting, image),
          custom_seeds (id, name, type, bean_type, category, latin, difficulty, exposure, matures_in_days, matures_under_days, description, timing, starting, growing, harvest, companion_planting, image)`,
          )
          .eq('user_id', profile?.id),
        fetchPlantingActions(),
      ]);

      if (collection.error) {
        dispatch({ type: LOAD_ERROR, payload: collection.error.message });
        return;
      }

      const userSeeds: UserSeedItem[] = (collection.data ?? []).map((row: any) => {
        const source = row.seed_catalog ?? row.custom_seeds;
        const category = source?.category ?? '';
        const planting = getCategoryPlantingActions(category, plantingActions);
        return createUserSeedFromDatabase(row, planting);
      });

      dispatch({ type: LOAD_SUCCESS, payload: userSeeds });
    } catch (error) {
      dispatch({ type: LOAD_ERROR, payload: error instanceof Error ? error.message : 'Failed to load user seeds' });
    }
  }, [profile?.id]);

  // Load user seeds when component mounts and there is a profile
  useEffect(() => {
    if (!profile?.id) return; // No profile means no user seeds to load
    loadUserSeeds();
  }, [profile?.id, loadUserSeeds]);

  const addSeedFromCatalog = async (catalogSeed: CatalogSeedItem) => {
    if (!profile?.id) return;

    // Avoid duplicate seeds
    const duplicateSeed = state.seeds.some((s) => s.catalog_seed_id === catalogSeed.id);
    if (duplicateSeed) return;

    // Add seed optimistically
    dispatch({ type: ADD_SEED_FROM_CATALOG, payload: catalogSeed });

    // Update database
    const { error } = await supabase.from('user_seed_collection').insert({
      user_id: profile.id,
      catalog_seed_id: catalogSeed.id,
    });

    // Rollback to previous state if error
    if (error) {
      dispatch({ type: DELETE_SEED_BY_CATALOG_ID, payload: catalogSeed.id });
      console.error('Error adding seed to collection:', error.message);
    }
  };

  const addCustomSeed = async (seed: UserSeedItem) => {
    if (!profile?.id) return;

    // Avoid duplicate seeds
    const duplicateSeed = state.seeds.some((s) => s.name === seed.name);
    if (duplicateSeed) return;

    // Add seed optimistically
    dispatch({ type: ADD_CUSTOM_SEED, payload: seed });

    // Update database
    const { error } = await supabase.from('user_seed_collection').insert({
      user_id: profile.id,
      custom_seed_id: seed.id,
    });

    // Rollback to previous state if error
    if (error) {
      dispatch({ type: DELETE_SEED_BY_CUSTOM_ID, payload: seed.id });
      console.error('Error adding custom seed to collection:', error.message);
    }
  };

  const deleteSeedByCatalogId = async (seed: UserSeedItem) => {
    if (!profile?.id) return;

    // Remove seed optimistically
    dispatch({ type: DELETE_SEED_BY_CATALOG_ID, payload: seed.catalog_seed_id });

    // Update database
    const { error } = await supabase
      .from('user_seed_collection')
      .delete()
      .eq('user_id', profile.id)
      .eq('catalog_seed_id', seed.catalog_seed_id);

    // Rollback to previous state if error
    if (error) {
      dispatch({ type: ADD_SEED_FROM_CATALOG, payload: seed });
      console.error('Error removing seed from collection:', error.message);
    }
  };

  const deleteSeedByCustomId = async (seed: UserSeedItem) => {
    if (!profile?.id) return;

    // Remove seed optimistically
    dispatch({ type: DELETE_SEED_BY_CUSTOM_ID, payload: seed.custom_seed_id });

    // Update database
    const { error } = await supabase.from('user_seed_collection').delete().eq('user_id', profile.id).eq('custom_seed_id', seed.id);

    // Rollback to previous state if error
    if (error) {
      dispatch({ type: ADD_CUSTOM_SEED, payload: seed });
      console.error('Error removing seed from collection:', error.message);
    }
  };

  const value = useMemo(
    () => ({
      seeds: state.seeds,
      loading: state.loading,
      error: state.error,
      addSeedFromCatalog,
      addCustomSeed,
      deleteSeedByCatalogId,
      deleteSeedByCustomId,
      refresh: loadUserSeeds,
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

export function useUserSeeds() {
  const context = useContext(UserSeedsContext);

  if (!context) throw new Error('useUserSeeds must be used within a UserSeedsProvider');

  return context;
}
