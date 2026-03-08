import { Stack } from 'expo-router';

// Screen stack for the home tab
export default function AccountLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'Account' }} />
    </Stack>
  );
}
