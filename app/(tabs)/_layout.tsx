import { Tabs } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors } from '../../styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// (tabs)/_layout.tsx: Tabs layout for the app
export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.greenMedium,
        tabBarInactiveTintColor: colors.secondary,
        headerShown: false,
        tabBarItemStyle: {
          marginTop: 6,
        },
        tabBarStyle: {
          paddingHorizontal: 12,
          paddingBottom: insets.bottom,
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 2,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Seeds',
          popToTopOnBlur: true,
          tabBarIcon: ({ color }) => <FontAwesome6 name="seedling" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          tabBarLabel: 'Gallery',
          tabBarIcon: ({ color }) => <FontAwesome6 name="images" size={26} color={color} />,
        }}
      />
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

// ---- REFERENCES ----
// JS tabs: https://docs.expo.dev/router/advanced/tabs/
// https://docs.expo.dev/router/advanced/tabs/#tab-bar-options
