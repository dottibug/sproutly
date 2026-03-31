import { Stack, Redirect } from 'expo-router';
import { useAuth } from '../../state/auth/AuthContext';
import AppLoadingScreen from '../../components/ui/AppLoadingScreen';

// (auth)/_layout.tsx: Layout for the app auth screens. Redirects user to home screen (home)/_index.tsx if already signed in. Otherwise displays the sign-in/sign-up screens.
export default function AuthLayout() {
  const { session, loading } = useAuth();

  if (loading) return <AppLoadingScreen />;
  if (session) return <Redirect href="/home" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signUp" />
    </Stack>
  );
}
