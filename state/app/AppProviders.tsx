import { PaperProvider } from 'react-native-paper';
import {
  UserSeedProvider,
  CustomSeedProvider,
  TaskProvider,
  FilterProvider,
  BrowseSeedProvider,
  NoteProvider,
} from '../barrels/contextBarrel';

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
            <TaskProvider>
              <NoteProvider>
                <FilterProvider>{children}</FilterProvider>
              </NoteProvider>
            </TaskProvider>
          </CustomSeedProvider>
        </UserSeedProvider>
      </BrowseSeedProvider>
    </PaperProvider>
  );
}
