import { createContext, useReducer, useCallback, useMemo, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../supabase';
import type { UserSeedItem } from '../seedCatalog';

// TODO streamline

// UserSeedsContext.tsx follows the React context & reducer pattern to manage state for the user's seeds.
// Prefer this pattern to avoid deep prop drilling in React components.
// https://react.dev/learn/scaling-up-with-reducer-and-context

// Magic strings
const LOAD_START = 'LOAD_START';
const LOAD_SUCCESS = 'LOAD_SUCCESS';
const LOAD_ERROR = 'LOAD_ERROR';
const ADD_SEED = 'ADD_SEED';
const DELETE_SEED = 'DELETE_SEED';

// State
type UserSeedsState = {
  seeds: UserSeedItem[];
  loading: boolean;
  error: string | null;
};

// Actions
type UserSeedsAction =
  | { type: typeof LOAD_START }
  | { type: typeof LOAD_SUCCESS; payload: UserSeedItem[] }
  | { type: typeof LOAD_ERROR; payload: string }
  | { type: typeof ADD_SEED; payload: UserSeedItem }
  | { type: typeof DELETE_SEED; payload: string };

// Initial state
const initialState: UserSeedsState = {
  seeds: [],
  loading: false,
  error: null,
};

// Reducer function to update the state based on the action
function userSeedsReducer(state: UserSeedsState, action: UserSeedsAction): UserSeedsState {
  switch (action.type) {
    case LOAD_START:
      return { ...state, loading: true, error: null };
    case LOAD_SUCCESS:
      return { ...state, seeds: action.payload, loading: false, error: null };
    case LOAD_ERROR:
      return { ...state, loading: false, error: action.payload };
    case ADD_SEED:
      const seed = action.payload;

      // Don't add the seed if it is already in the collection
      if (state.seeds.some((s) => s.id === seed.id)) return state;

      return {
        ...state,
        seeds: [
          ...state.seeds,
          {
            id: seed.id,
            catalog_seed_id: seed.catalog_seed_id,
            custom_seed_id: seed.custom_seed_id,
            name: seed.name,
            sku: seed.sku,
            type: seed.type,
            bean_type: seed.bean_type,
            category: seed.category,
            latin: seed.latin,
            difficulty: seed.difficulty,
            exposure: seed.exposure,
            matures_in_days: seed.matures_in_days,
            matures_under_days: seed.matures_under_days,
            description: seed.description,
            timing: seed.timing,
            starting: seed.starting,
            growing: seed.growing,
            harvest: seed.harvest,
            companion_planting: seed.companion_planting,
            image: seed.image,
            notes: seed.notes,
          },
        ],
      };
    case DELETE_SEED:
      const catalogSeedId = action.payload;
      return { ...state, seeds: state.seeds.filter((s) => s.catalog_seed_id !== catalogSeedId) };
    default:
      return state;
  }
}

// Context value type to pass to provider
type UserSeedsContextValue = {
  seeds: UserSeedItem[];
  loading: boolean;
  error: string | null;
  addSeed: (seed: UserSeedItem) => void;
  deleteSeed: (seed: UserSeedItem) => void;
  refresh: () => Promise<void>;
};

const UserSeedsContext = createContext<UserSeedsContextValue | null>(null);

export function UserSeedsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(userSeedsReducer, initialState);

  const { profile } = useAuth();

  const loadUserSeeds = useCallback(async () => {
    dispatch({ type: LOAD_START });

    try {
      const { data, error } = await supabase
        .from('user_seed_collection')
        .select(
          `
    id,
    catalog_seed_id,
    custom_seed_id,
    notes,
    seed_catalog (
      id, name, sku, type, bean_type, category, latin, difficulty, exposure,
      matures_in_days, matures_under_days, description, timing, starting,
      growing, harvest, companion_planting, image
    ),
    custom_seeds (
      id, name, type, bean_type, category, latin, difficulty, exposure,
      matures_in_days, matures_under_days, description, timing, starting,
      growing, harvest, companion_planting, image
    )
    `,
        )
        .eq('user_id', profile?.id);

      if (error) {
        dispatch({ type: LOAD_ERROR, payload: error.message });
        return;
      }

      const userSeeds: UserSeedItem[] = (data ?? []).map((row: any) => {
        const source = row.seed_catalog ?? row.custom_seeds;
        if (!source) throw new Error(`User seed row ${row.id} has no seed_catalog or custom_seeds`);

        return {
          id: row.id,
          catalog_seed_id: row.catalog_seed_id,
          custom_seed_id: row.custom_seed_id,
          notes: row.notes,
          name: source.name,
          sku: source.sku,
          type: source.type,
          bean_type: source.bean_type,
          category: source.category,
          latin: source.latin,
          difficulty: source.difficulty,
          exposure: source.exposure,
          matures_in_days: source.matures_in_days,
          matures_under_days: source.matures_under_days,
          description: source.description,
          timing: source.timing,
          starting: source.starting,
          growing: source.growing,
          harvest: source.harvest,
          companion_planting: source.companion_planting,
          image: source.image,
        };
      });

      dispatch({ type: LOAD_SUCCESS, payload: userSeeds });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load user seeds';
      dispatch({ type: LOAD_ERROR, payload: message });
    }
  }, [profile?.id]);

  useEffect(() => {
    loadUserSeeds();
  }, [loadUserSeeds]);

  // Add seed optimistically (update state immediately, then update database; rollback if error)
  const addSeed = useCallback(
    (seed: UserSeedItem) => {
      dispatch({ type: ADD_SEED, payload: seed });

      supabase
        .from('user_seed_collection')
        .insert({
          user_id: profile?.id,
          catalog_seed_id: seed.id,
        })
        .then(({ error }) => {
          // todo: rollback to previous state if error
          console.log('Error adding seed to collection:', error);
        });
    },
    [profile?.id],
  );

  const deleteSeed = useCallback(
    (seed: UserSeedItem) => {
      dispatch({ type: DELETE_SEED, payload: seed.id });

      supabase
        .from('user_seed_collection')
        .delete()
        .eq('user_id', profile?.id)
        .eq('catalog_seed_id', seed.id)
        .then(({ error }) => {
          // todo: rollback to previous state if error
          console.log('Error removing seed from collection:', error);
        });
    },
    [profile?.id],
  );

  const refresh = useCallback(async () => {
    dispatch({ type: LOAD_START });

    supabase
      .from('user_seed_collection')
      .select('*')
      .eq('user_id', profile?.id)
      .then(({ data, error }) => {
        if (error) dispatch({ type: LOAD_ERROR, payload: error.message });
        else dispatch({ type: LOAD_SUCCESS, payload: data });
      });
  }, [profile?.id]);

  const value = useMemo(
    () => ({
      seeds: state.seeds,
      loading: state.loading,
      error: state.error,
      addSeed,
      deleteSeed,
      refresh: loadUserSeeds,
    }),
    [state.seeds, state.loading, state.error, addSeed, deleteSeed, loadUserSeeds],
  );

  return <UserSeedsContext.Provider value={value}>{children}</UserSeedsContext.Provider>;
}

export function useUserSeeds() {
  const context = useContext(UserSeedsContext);
  if (!context) throw new Error('useUserSeeds must be used within a UserSeedsProvider');
  return context;
}
