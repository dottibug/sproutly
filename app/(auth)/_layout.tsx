import { useAuth } from '../../lib/contexts/AuthContext';
import { useRouter, Stack } from 'expo-router';
import { useEffect } from 'react';
import AppLoadingScreen from '../../components/ui/AppLoadingScreen';

export default function AuthLayout() {
  const { session, loading } = useAuth();
  const router = useRouter();

  console.log('AuthLayout rendered');
  console.log('session', session);
  console.log('loading', loading);

  useEffect(() => {
    if (loading) return;
    if (session) router.replace('/(tabs)');
  }, [session, loading, router]);

  if (loading) return <AppLoadingScreen />;

  // If the user is already signed in, redirect to the tabs
  if (session) return null;

  // If the user is signed out, show the auth screens
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signUp" />
    </Stack>
  );
}
