import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProviders } from '../state/app/AppProviders';
import { AuthProvider } from '../state/auth/AuthContext';
import { useFonts } from '@expo-google-fonts/aladin/useFonts';
import { Aladin_400Regular } from '@expo-google-fonts/aladin/400Regular';
import AppLoadingScreen from '../components/ui/AppLoadingScreen';
import { colors } from '../styles/theme';

// app/_layout.tsx: Root layout that wraps the whole app
export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    Aladin_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoadingScreen />;
  }
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
