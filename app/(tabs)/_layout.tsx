import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// JS tabs: https://docs.expo.dev/router/advanced/tabs/

// Tabs layout for the app
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'purple', tabBarInactiveTintColor: 'gray', headerShown: false }}>
      {/* Home*/}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <FontAwesome6 name="house" size={22} color={color} />,
        }}
      />

      {/* Seed Catalog Tab */}
      <Tabs.Screen
        name="catalog"
        options={{
          title: 'Seed Catalog',
          tabBarLabel: 'Seed Catalog',
          tabBarIcon: ({ color, size }) => <FontAwesome6 name="seedling" size={22} color={color} />,
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
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-sharp" size={size ?? 24} color={color} />,
        }}
      />

      {/* Account Tab */}
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => <MaterialIcons name="account-circle" size={size ?? 24} color={color} />,
        }}
      />
    </Tabs>
  );
}
