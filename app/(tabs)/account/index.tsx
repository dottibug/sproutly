import { Text, View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../lib/contexts/AuthContext';
import { useFilters, FILTERS, Filter } from '../../../lib/contexts/FiltersContext';
import CustomFilterOrderModal from '../../../components/filters/CustomFilterOrderModal';
import Toggle from '../../../components/ui/Toggle';
import Button from '../../../components/ui/buttons/Button';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colors } from '../../../styles/theme';

// TODO: styling
// TODO clicking settings brings you to settings screen to adjust filter order etc?

// Account tab screen
export default function AccountScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const { preferences, setFilterPreferences, saveFilterPreferences } = useFilters();

  const handleOpenByDefaultToggle = useCallback(
    (filter: Filter) => {
      const openByDefault = preferences.openByDefault.includes(filter)
        ? preferences.openByDefault.filter((f) => f !== filter)
        : [...preferences.openByDefault, filter];
      setFilterPreferences({ ...preferences, openByDefault });
    },
    [preferences, setFilterPreferences],
  );

  const handleSaveFilterPreferences = useCallback(async () => {
    await saveFilterPreferences();
  }, [saveFilterPreferences, preferences]);

  const handleRequestCloseModal = () => setModalVisible(false);

  const handleSignOut = async () => {
    console.log('Signing out');
    await signOut();
    console.log('Signed out');
    router.replace('/(auth)/');
    console.log('Redirected to auth');
  };

  const tempHandleFilterOrderPress = () => {
    console.log('Filter order pressed');
    console.log('will open modal to adjust filter order');
    setModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <Text>change username</Text>
      <Text>change avatar</Text>
      <Text>delete account</Text>

      {/* Settings */}
      <View style={styles.tempFilterSettingsContainer}>
        <Pressable style={styles.tempFilterOrderContainer} onPress={tempHandleFilterOrderPress}>
          <Text style={{ fontWeight: 'bold' }}>Custom Filter Order TEMP</Text>
          <CustomFilterOrderModal visible={modalVisible} onRequestClose={handleRequestCloseModal} />
        </Pressable>

        <Text style={{ fontWeight: 'bold' }}>Filter Open By Default Settings</Text>
        <View style={styles.tempFilterOpenContainer}>
          {FILTERS.map((filter) => (
            <View key={filter} style={styles.tempFilterOpenItem}>
              <Toggle filter={filter} value={preferences.openByDefault.includes(filter)} onToggle={handleOpenByDefaultToggle} />
              <Text>{filter}</Text>
            </View>
          ))}
        </View>
        <Button text="Save Changes" size="small" onPress={handleSaveFilterPreferences} />
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
    </ScrollView>
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
    borderWidth: 1,
    padding: 12,
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
