import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

// Tabs layout for the app
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'purple', tabBarInactiveTintColor: 'gray', headerShown: false }}>
      {/* My Seeds Tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'My Seeds',
          tabBarLabel: 'My Seeds',
          tabBarIcon: ({ color, size }) => <Ionicons name="leaf" size={size ?? 24} color={color} />,
        }}
      />

      {/* Seed Catalog Tab */}
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Seed Catalog',
          tabBarLabel: 'Seed Catalog',
          tabBarIcon: ({ color, size }) => <Ionicons name="library" size={size ?? 24} color={color} />,
        }}
      />

      {/* Reminders Tab */}
      <Tabs.Screen
        name="reminders"
        options={{
          title: 'Reminders',
          tabBarLabel: 'Reminders',
          tabBarIcon: ({ color, size }) => <Ionicons name="alarm" size={size ?? 24} color={color} />,
        }}
      />

      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => <Ionicons name="settings" size={size ?? 24} color={color} />,
        }}
      />
    </Tabs>
  );
}
