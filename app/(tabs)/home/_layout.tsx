import { Stack } from 'expo-router';

// (tabs)/home/_layout.tsx: Layout for the home tab
export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ headerBackButtonDisplayMode: 'generic' }} />
    </Stack>
  );
}
