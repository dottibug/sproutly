import { Stack } from 'expo-router';

// Screen stack for the catalog tab
export default function CatalogLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: 'Seed Catalog' }} />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Seed Details',
          headerBackButtonDisplayMode: 'generic',
        }}
      />
    </Stack>
  );
}
