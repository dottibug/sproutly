import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { useFilters } from '../../../state/filters/FiltersContext';
import { SearchFilter, SEARCH_FILTER_NAMES, FILTER_NAME_MAP } from '../../../state/filters/filterTypes';
import { Switch, Divider } from 'react-native-paper';
import { AppButton, Heading, ScreenOptions } from '../../../components/uiComponentBarrel';
import DraggableFilters from '../../../components/filters/DraggableFilters';
import { colors } from '../../../styles/theme';

// Settings.tsx: Displays settings available for the user to customize the seed filters.
export default function Settings() {
  const { preferences, setFilterPreferences, saveFilterPreferences } = useFilters();
  const { openByDefault } = preferences;
  const [editingFilterOrder, setEditingFilterOrder] = useState<SearchFilter[]>(preferences.order);
  const [filterDragActive, setFilterDragActive] = useState(false);

  // Sync the editing filter order with user preferences
  useEffect(() => {
    setEditingFilterOrder(preferences.order);
  }, [preferences.order]);

  // Save new filter order to the database
  const handleSaveFilterOrder = useCallback(async () => {
    try {
      const newPrefs = { ...preferences, order: editingFilterOrder };
      setFilterPreferences(newPrefs);
      await saveFilterPreferences(newPrefs);
      Alert.alert('Settings saved', 'Your filter preferences were updated successfully.');
    } catch {
      Alert.alert('Could not save', 'Please sign in again and try once more.');
    }
  }, [saveFilterPreferences, preferences, editingFilterOrder, setFilterPreferences]);

  // Save new open filter preferences to the database
  const handleSaveOpenFilterPreferences = useCallback(async () => {
    try {
      const newPrefs = { ...preferences, openByDefault: openByDefault };
      setFilterPreferences(newPrefs);
      await saveFilterPreferences(newPrefs);
      Alert.alert('Settings saved', 'Your filter preferences were updated successfully.');
    } catch {
      Alert.alert('Could not save', 'Please sign in again and try once more.');
    }
  }, [saveFilterPreferences, preferences, setFilterPreferences, openByDefault]);

  // Toggles the "default open" filter settings (in the UI)
  const toggleOpenByDefault = useCallback(
    (filter: SearchFilter) => {
      const updatedOpenByDefault = openByDefault.includes(filter) ? openByDefault.filter((f) => f !== filter) : [...openByDefault, filter];
      setFilterPreferences({ ...preferences, openByDefault: updatedOpenByDefault });
    },
    [openByDefault, preferences, setFilterPreferences],
  );

  return (
    <ScrollView
      style={styles.container}
      scrollEnabled={!filterDragActive}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 32 }}>
      <ScreenOptions backButtonMode="generic" title="Settings" backTitle="Back" />
      <View style={styles.settingsSection}>
        <View style={styles.settingsSectionHeader}>
          <Heading size="small">{SEED_FILTERS_TITLE}</Heading>
          <Text style={styles.settingsDescription}>{SEED_FILTERS_DESCRIPTION}</Text>
        </View>
        <View style={styles.filterOrderList}>
          <DraggableFilters order={editingFilterOrder} onOrderChange={setEditingFilterOrder} onDragActiveChange={setFilterDragActive} />
        </View>
        <View style={styles.saveButtonContainer}>
          <AppButton text="Save Filter Order" size="xsmall" onPress={handleSaveFilterOrder} rounded />
        </View>
      </View>

      <Divider theme={{ colors: { primary: colors.gray300 } }} bold={true} style={styles.divider} />

      {/* Default open filters */}
      <View style={styles.settingsSection}>
        <View style={styles.settingsSectionHeader}>
          <Heading size="small">{DEFAULT_OPEN_FILTERS_TITLE}</Heading>
          <Text style={styles.settingsDescription}>{DEFAULT_OPEN_FILTERS_DESCRIPTION}</Text>
        </View>
        <View style={styles.switchList}>
          {SEARCH_FILTER_NAMES.map((filter: SearchFilter) => (
            <View key={filter} style={styles.switchRow}>
              <View style={styles.switchContainer}>
                <Switch
                  value={openByDefault.includes(filter)}
                  onValueChange={() => toggleOpenByDefault(filter)}
                  color={colors.greenLight}
                />
              </View>
              <Text style={styles.switchLabel}>{FILTER_NAME_MAP[filter]}</Text>
            </View>
          ))}
        </View>
        <View style={styles.saveButtonContainer}>
          <AppButton text="Save Open Filters" size="xsmall" onPress={handleSaveOpenFilterPreferences} rounded />
        </View>
      </View>
    </ScrollView>
  );
}

// ---- CONSTANTS ----
const SEED_FILTERS_TITLE = 'Reorder seed filters';
const SEED_FILTERS_DESCRIPTION = 'Press and drag to reorder seed filters.';
const DEFAULT_OPEN_FILTERS_TITLE = 'Default open filters';
const DEFAULT_OPEN_FILTERS_DESCRIPTION = 'Choose which filters start expanded.';

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  settingsSection: {
    gap: 8,
  },
  settingsSectionHeader: {
    gap: 6,
  },
  settingsDescription: {
    color: colors.secondary,
    fontSize: 14,
  },
  switchList: {
    marginBottom: 6,
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
    minHeight: 48,
  },
  switchContainer: {
    transform: [{ scale: 0.75 }],
  },
  switchLabel: {
    color: colors.primary,
    flex: 1,
    fontSize: 16,
    marginRight: 14,
  },
  filterOrderList: {
    marginTop: -4,
  },
  saveButtonContainer: {
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 2,
  },
  divider: {
    marginVertical: 28,
  },
});
