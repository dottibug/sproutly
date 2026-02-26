import { SeedCatalogProvider } from './SeedCatalogContext';

// Single wrapper component for all providers the app needs to access shared state.
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <SeedCatalogProvider>{children}</SeedCatalogProvider>;
}
