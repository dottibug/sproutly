import React, { createContext, useCallback, useEffect, useContext, useReducer, useMemo } from 'react';
import { BrowseSeedAction, BrowseSeed } from './browseTypes';
import { runLoadCatalog } from './browseThunks';

// SeedCatalogContext.tsx follows the React context & reducer pattern to manage state for the seed catalog.
// Prefer this pattern to avoid deep prop drilling in React components.
// https://react.dev/learn/scaling-up-with-reducer-and-context

// TODO: Handle errors

// ---- INITIAL STATE SETUP ----
type BrowseSeedState = {
  seeds: BrowseSeed[];
  loading: boolean;
  error: string | null;
};

const initialState: BrowseSeedState = {
  seeds: [],
  loading: false,
  error: null,
};

// ---- REDUCER ----
function browseSeedReducer(state: BrowseSeedState, action: BrowseSeedAction): BrowseSeedState {
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
type BrowseSeedContextValue = {
  seeds: BrowseSeed[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const BrowseSeedContext = createContext<BrowseSeedContextValue | null>(null);

// ---- PROVIDER (passes context to children) ----
type BrowseSeedProviderProps = {
  readonly children: React.ReactNode;
};

export function BrowseSeedProvider({ children }: BrowseSeedProviderProps) {
  const [state, dispatch] = useReducer(browseSeedReducer, initialState);

  const loadCatalog = useCallback(async () => {
    await runLoadCatalog(dispatch);
  }, [dispatch]);

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
  return <BrowseSeedContext.Provider value={value}>{children}</BrowseSeedContext.Provider>;
}

// ---- CUSTOM HOOK (use in components to access the filter context) ----
export function useBrowseSeed() {
  const context = useContext(BrowseSeedContext);
  if (!context) throw new Error('useBrowseSeed must be used within a BrowseSeedProvider');
  return context;
}
