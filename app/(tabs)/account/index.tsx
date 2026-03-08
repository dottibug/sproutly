import { Text, View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '../../../lib/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useFilters, FILTERS, Filter } from '../../../lib/contexts/FiltersContext';
import { colors } from '../../../styles/theme';
import Toggle from '../../../components/ui/Toggle';
import { useCallback } from 'react';
import Button from '../../../components/ui/buttons/Button';

// Account tab screen
export default function AccountScreen() {
  const { signOut } = useAuth();
  const router = useRouter();

  const { preferences, setFilterPreferences, saveFilterPreferences } = useFilters();

  const handleExpandedByDefaultToggle = useCallback(
    (filter: Filter) => {
      const expandedByDefault = preferences.expandedByDefault.includes(filter)
        ? preferences.expandedByDefault.filter((f) => f !== filter)
        : [...preferences.expandedByDefault, filter];
      setFilterPreferences({ ...preferences, expandedByDefault });
    },
    [preferences, setFilterPreferences],
  );

  const handleSaveFilterPreferences = useCallback(async () => {
    await saveFilterPreferences();
  }, [saveFilterPreferences]);

  const handleSignOut = async () => {
    console.log('Signing out');
    await signOut();
    console.log('Signed out');
    router.replace('/(auth)/');
    console.log('Redirected to auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <Text>change username</Text>
      <Text>change avatar</Text>
      <Text>delete account</Text>

      {/* Settings */}
      <View style={styles.tempFilterSettingsContainer}>
        <Text style={{ fontWeight: 'bold' }}>Filter Order Settings</Text>
        <View style={styles.tempFilterOrderContainer}></View>

        <Text style={{ fontWeight: 'bold' }}>Filter Open By Default Settings</Text>
        <View style={styles.tempFilterOpenContainer}>
          {FILTERS.map((filter) => (
            <View key={filter} style={styles.tempFilterOpenItem}>
              <Toggle filter={filter} value={preferences.expandedByDefault.includes(filter)} onToggle={handleExpandedByDefaultToggle} />
              <Text>{filter}</Text>
            </View>
          ))}
          <Button text="Save Changes" size="small" onPress={handleSaveFilterPreferences} />
        </View>
      </View>

      {/* <Text>Reset Filter Preferences</Text> */}
      <Text>settings link</Text>
      <Text>Settings to include on the settings screen:</Text>
      <Text>Dark mode</Text>
      <Text>Quick filters</Text>
      <Text>Possibly basic vs detailed seed cards on the user collection screen</Text>

      <Pressable style={styles.signOut} onPress={handleSignOut}>
        <MaterialIcons name="logout" size={24} color="black" />
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
  },
  signOutText: {
    fontSize: 18,
  },
  tempFilterSettingsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    gap: 12,
  },
  tempFilterOrderContainer: {
    gap: 12,
  },
  tempFilterOpenContainer: {
    gap: 12,
  },
  tempFilterOpenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
