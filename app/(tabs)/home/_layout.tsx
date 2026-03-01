import { Stack } from 'expo-router';

// Screen stack for the home tab
export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'My Seeds' }} />
      {/* <Stack.Screen
        name="[id]"
        options={{
          title: 'Seed Details',
          headerBackButtonDisplayMode: 'generic',
        }}
      /> */}
    </Stack>
  );
}
