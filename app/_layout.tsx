import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from '../lib/contexts/AppProviders';
import { AuthProvider } from '../lib/contexts/AuthContext';
import { UserSeedsProvider } from '../lib/contexts/UserSeedsContext';

// Root layout that wraps the whole app
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProviders>
          <UserSeedsProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
            </Stack>
          </UserSeedsProvider>
        </AppProviders>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
