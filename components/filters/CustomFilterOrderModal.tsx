import { View, StyleSheet } from 'react-native';
import { useCallback, useState, useEffect } from 'react';
import { useFilters } from '../../lib/contexts/FiltersContext';
import { Filter } from '../../lib/types';
import AppModal from '../ui/AppModal';
import Button from '../ui/buttons/Button';
import DraggableFilterOrder from './DraggableFilterOrder';

// TODO: styling and add description of the setting
// TODO: styling (and change the close button to a proper x icon in the corner)
type CustomFilterOrderModalProps = {
  readonly visible: boolean;
  readonly onRequestClose: () => void;
};

export default function CustomFilterOrderModal({ visible, onRequestClose }: CustomFilterOrderModalProps) {
  const { preferences, setFilterPreferences, saveFilterPreferences } = useFilters();
  const [editingOrder, setEditingOrder] = useState<Filter[]>(preferences.order);

  const handleSave = useCallback(async () => {
    setFilterPreferences({ ...preferences, order: editingOrder });
    await saveFilterPreferences();
  }, [saveFilterPreferences, editingOrder, setFilterPreferences, preferences]);

  // Update the editing order when the filters order changes
  useEffect(() => setEditingOrder(preferences.order), [preferences.order]);

  return (
    <AppModal visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.modalContent}>
        <DraggableFilterOrder order={editingOrder} onOrderChange={setEditingOrder} />
        <Button text="Save Changes" size="small" onPress={handleSave} />
        <Button text="Close" size="small" onPress={onRequestClose} />
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    gap: 12,
    height: 400,
  },
});
