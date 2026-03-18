import { Modal, View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Button from '../ui/buttons/Button';
import { appStyles } from '../../styles/theme';

// TODO: Styling
// TODO: going to the browse tab is working, but the screen loads slow

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
    <Modal visible={visible} onRequestClose={onRequestClose} transparent={true}>
      <View style={appStyles.modalContainer}>
        <View style={appStyles.modalContent}>
          <Text>Add Seed Modal</Text>
          <Button text="Add Catalog Seed" size="small" onPress={handleAddCatalogSeed} />
          <Button text="Add Custom Seed" size="small" onPress={handleAddCustomSeed} />
          <Button text="Close" size="small" onPress={onRequestClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({});
