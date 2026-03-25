import { useRouter, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../state/auth/AuthContext';
import AppLoadingScreen from '../../components/ui/AppLoadingScreen';

// (auth)/_layout.tsx: Layout for the app auth screens. Redirects user to home screen (home)/_index.tsx if already signed in. Otherwise displays the sign-in/sign-up screens.
export default function AuthLayout() {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (session) router.replace('/(tabs)/home');
  }, [session, loading, router]);

  if (loading) return <AppLoadingScreen />;
  if (session) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signUp" />
    </Stack>
  );
}
