import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors } from '../../styles/theme';

// JS tabs: https://docs.expo.dev/router/advanced/tabs/
// https://docs.expo.dev/router/advanced/tabs/#tab-bar-options

// TODO: change tabBarActiveTintColor

// Tabs layout for the app
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'purple',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarItemStyle: {
          marginTop: 6,
        },
        tabBarStyle: {
          paddingHorizontal: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 2,
        },
      }}>
      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Seeds',
          popToTopOnBlur: true,
          tabBarIcon: ({ color }) => <FontAwesome6 name="seedling" size={24} color={color} />,
        }}
      />

      {/* Gallery Tab */}
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          tabBarLabel: 'Gallery',
          tabBarIcon: ({ color }) => <FontAwesome6 name="images" size={26} color={color} />,
        }}
      />

      {/* Account Tab */}
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => <MaterialIcons name="account-circle" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
