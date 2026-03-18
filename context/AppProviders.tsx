import { SeedCatalogProvider } from './SeedCatalogContext';
import { UserSeedsProvider } from './UserSeedsContext';
import { FilterProvider } from './FiltersContext';
import { PaperProvider } from 'react-native-paper';
import { CustomSeedProvider } from './CustomSeedContext';

type AppProvidersProps = {
  readonly children: React.ReactNode;
};

// Single wrapper component for all providers the app needs to access shared state.
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <PaperProvider>
      <SeedCatalogProvider>
        <UserSeedsProvider>
          <CustomSeedProvider>
            <FilterProvider>{children}</FilterProvider>
          </CustomSeedProvider>
        </UserSeedsProvider>
      </SeedCatalogProvider>
    </PaperProvider>
  );
}
