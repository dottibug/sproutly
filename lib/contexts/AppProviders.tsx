import { SeedCatalogProvider } from './SeedCatalogContext';
import { UserSeedsProvider } from './UserSeedsContext';
import { FilterProvider } from './FiltersContext';

type AppProvidersProps = {
  readonly children: React.ReactNode;
};

// Single wrapper component for all providers the app needs to access shared state.
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SeedCatalogProvider>
      <UserSeedsProvider>
        <FilterProvider>{children}</FilterProvider>
      </UserSeedsProvider>
    </SeedCatalogProvider>
  );
}
