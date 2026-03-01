import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from '../lib/contexts/AppProviders';
import { AuthProvider } from '../lib/contexts/AuthContext';
import { UserSeedsProvider } from '../lib/contexts/UserSeedsContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Root layout that wraps the whole app
export default function RootLayout() {
  return (
    <GestureHandlerRootView>
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
    </GestureHandlerRootView>
  );
}
