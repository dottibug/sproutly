import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from '../state/app/AppProviders';
import { AuthProvider } from '../state/app/AuthContext';

// Root layout that wraps the whole app
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppProviders>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </AppProviders>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
