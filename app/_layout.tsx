import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from '../context/AppProviders';
import { AuthProvider } from '../context/AuthContext';

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
