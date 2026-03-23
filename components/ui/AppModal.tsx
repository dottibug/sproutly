import { Modal, View, Text, StyleSheet } from 'react-native';
import { appStyles, colors } from '../../styles/theme';
import Button from './buttons/AppButton';
import IconButton from './buttons/IconButton';
import Heading from './Heading';

type AppModalProps = {
  readonly visible: boolean;
  readonly onRequestClose: () => void;
  readonly title?: string;
  readonly children: React.ReactNode;
};

export default function AppModal({ visible, onRequestClose, title, children }: AppModalProps) {
  const hasTitle = title !== undefined;

  return (
    <Modal visible={visible} onRequestClose={onRequestClose} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.closeButtonContainer}>
            <IconButton icon="close" size={24} onPress={onRequestClose} />
          </View>
          {hasTitle && <Heading size="small">{title}</Heading>}
          {children}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 20,
    elevation: 5,
    gap: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: '80%',
  },
  closeButtonContainer: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 16,
    top: 16,
    width: 32,
    zIndex: 1000,
  },
});
