import { BrowseSeedProvider } from '../browseSeeds/BrowseSeedContext';
import { UserSeedProvider } from '../userSeeds/UserSeedsContext';
import { FilterProvider } from '../filters/FiltersContext';
import { PaperProvider } from 'react-native-paper';
import { CustomSeedProvider } from '../customSeeds/CustomSeedContext';

type AppProvidersProps = {
  readonly children: React.ReactNode;
};

// Single wrapper component for all providers the app needs to access shared state.
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <PaperProvider>
      <BrowseSeedProvider>
        <UserSeedProvider>
          <CustomSeedProvider>
            <FilterProvider>{children}</FilterProvider>
          </CustomSeedProvider>
        </UserSeedProvider>
      </BrowseSeedProvider>
    </PaperProvider>
  );
}
