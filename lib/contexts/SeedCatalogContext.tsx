import React, { createContext, useCallback, useEffect, useContext, useReducer, useMemo } from 'react';
import { CatalogSeedItem } from '../types';
import { getSeedCatalog } from '../utils/seedCatalogUtils';

// SeedCatalogContext.tsx follows the React context & reducer pattern to manage state for the seed catalog.
// Prefer this pattern to avoid deep prop drilling in React components.
// https://react.dev/learn/scaling-up-with-reducer-and-context

// TODO: Handle errors

// ---- TYPES ----
type SeedCatalogAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: CatalogSeedItem[] }
  | { type: 'LOAD_ERROR'; payload: string };

// ---- INITIAL STATE SETUP ----
type SeedCatalogState = {
  seeds: CatalogSeedItem[];
  loading: boolean;
  error: string | null;
};

const initialState: SeedCatalogState = {
  seeds: [],
  loading: false,
  error: null,
};

// ---- REDUCER ----
function seedCatalogReducer(state: SeedCatalogState, action: SeedCatalogAction): SeedCatalogState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { seeds: action.payload, loading: false, error: null };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

// ---- CONTEXT SETUP ----
type SeedCatalogContextValue = {
  seeds: CatalogSeedItem[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const SeedCatalogContext = createContext<SeedCatalogContextValue | null>(null);

// ---- PROVIDER (passes context to children) ----
type SeedCatalogProviderProps = {
  readonly children: React.ReactNode;
};

export function SeedCatalogProvider({ children }: SeedCatalogProviderProps) {
  const [state, dispatch] = useReducer(seedCatalogReducer, initialState);

  const loadCatalog = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });

    try {
      const seeds = await getSeedCatalog();
      dispatch({ type: 'LOAD_SUCCESS', payload: seeds });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load seed catalog';
      dispatch({ type: 'LOAD_ERROR', payload: message });
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

// ---- CUSTOM HOOK (use in components to access the filter context) ----
export function useSeedCatalog() {
  const context = useContext(SeedCatalogContext);
  if (!context) throw new Error('useSeedCatalog must be used within a SeedCatalogProvider');
  return context;
}
