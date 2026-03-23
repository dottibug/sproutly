import { Modal, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Button from '../ui/buttons/AppButton';
import { appStyles } from '../../styles/theme';
import AppModal from '../ui/AppModal';

// TODO: Styling
// TODO: Better text in the modal to explain the options to the user

type AddSeedModalProps = {
  readonly visible: boolean;
  readonly onRequestClose: () => void;
  readonly onGoToBrowse: () => void;
};

// Modal for adding a new seed to the user's collection
export default function AddSeedModal({ visible, onRequestClose, onGoToBrowse }: AddSeedModalProps) {
  const handleAddCatalogSeed = () => {
    onRequestClose();
    onGoToBrowse();
  };

  const handleAddCustomSeed = () => {
    onRequestClose();
    router.push({
      pathname: '/home/addCustomSeed',
    });
  };

  return (
    <AppModal visible={visible} onRequestClose={onRequestClose} title="Add Seed">
      <View style={styles.buttonContainer}>
        <Button text="Add Catalog Seed" size="small" onPress={handleAddCatalogSeed} />
        <Button text="Add Custom Seed" size="small" onPress={handleAddCustomSeed} />
      </View>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginVertical: 16,
    gap: 24,
  },
});
