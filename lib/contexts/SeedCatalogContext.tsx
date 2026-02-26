import React, { createContext, useCallback, useEffect, useContext, useReducer, useMemo } from 'react';
import { getSeedCatalog, type SeedCatalogItem } from '../seedCatalog';

// SeedCatalogContext.tsx follows the React context & reducer pattern to manage state for the seed catalog.
// Prefer this pattern to avoid deep prop drilling in React components.
// https://react.dev/learn/scaling-up-with-reducer-and-context

// Magic strings
const LOAD_START = 'LOAD_START';
const LOAD_SUCCESS = 'LOAD_SUCCESS';
const LOAD_ERROR = 'LOAD_ERROR';

// State
type SeedCatalogState = {
  seeds: SeedCatalogItem[];
  loading: boolean;
  error: string | null;
};

// Actions
type SeedCatalogAction =
  | { type: typeof LOAD_START }
  | { type: typeof LOAD_SUCCESS; payload: SeedCatalogItem[] }
  | { type: typeof LOAD_ERROR; payload: string };

// Initial state
const initialState: SeedCatalogState = {
  seeds: [],
  loading: false,
  error: null,
};

// Reducer function to update the state based on the action
function seedCatalogReducer(state: SeedCatalogState, action: SeedCatalogAction): SeedCatalogState {
  switch (action.type) {
    case LOAD_START:
      return { ...state, loading: true, error: null };
    case LOAD_SUCCESS:
      return { seeds: action.payload, loading: false, error: null };
    case LOAD_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

// Context value type to pass to provider
type SeedCatalogContextValue = {
  seeds: SeedCatalogItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const SeedCatalogContext = createContext<SeedCatalogContextValue | null>(null);

// Provider component to wrap the app and provide the context value to all components within
// useCallback memoizes the loadCatalog function to avoid unnecessary re-renders
export function SeedCatalogProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(seedCatalogReducer, initialState);

  const loadCatalog = useCallback(async () => {
    dispatch({ type: LOAD_START });

    try {
      const seeds = await getSeedCatalog();
      dispatch({ type: LOAD_SUCCESS, payload: seeds });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load seed catalog';
      dispatch({ type: LOAD_ERROR, payload: message });
    }
  }, []);

  // Load the catalog when the component mounts
  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const value = useMemo(
    () => ({
      seeds: state.seeds,
      loading: state.loading,
      error: state.error,
      refresh: loadCatalog,
    }),
    [state.seeds, state.loading, state.error, loadCatalog],
  );

  // Return the provider component with the context available to all child components
  return <SeedCatalogContext.Provider value={value}>{children}</SeedCatalogContext.Provider>;
}

// Custom hook to access the seed catalog context. Throws error if used outside the required provider component.
export function useSeedCatalog() {
  const context = useContext(SeedCatalogContext);
  if (!context) throw new Error('useSeedCatalog must be used within a SeedCatalogProvider');
  return context;
}
