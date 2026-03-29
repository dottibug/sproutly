import { Modal, View, StyleSheet } from 'react-native';
import { colors, shadowStyles } from '../../styles/theme';
import IconButton from './buttons/IconButton';
import Heading from './Heading';

// AppModal.tsx: A reusable modal component for the app. Title is optional, but the component must be controlled by the parent via visible and onRequestClose props.

type titleSize = 'xsmall' | 'small' | 'medium' | 'large';

type AppModalProps = {
  readonly visible: boolean;
  readonly onRequestClose: () => void;
  readonly title?: string;
  readonly children: React.ReactNode;
  readonly titleSize?: titleSize;
};

export default function AppModal({ visible, onRequestClose, title, children, titleSize = 'medium' }: AppModalProps) {
  const hasTitle = title !== undefined;

  return (
    <Modal visible={visible} onRequestClose={onRequestClose} animationType="fade" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, shadowStyles.shadowOnDarkBg]}>
          <View style={styles.headerContainer}>
            <View style={styles.closeButtonContainer}>
              <IconButton icon="close" size={24} onPress={onRequestClose} color={colors.primary} />
            </View>
            {hasTitle && (
              <View style={styles.titleContainer}>
                <Heading size={titleSize}>{title}</Heading>
              </View>
            )}
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  modalContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: colors.blackSheer80,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    gap: 12,
    paddingTop: 8,
    paddingHorizontal: 28,
    paddingBottom: 36,
  },
  headerContainer: {},
  closeButtonContainer: {
    alignItems: 'center',
    alignSelf: 'flex-end',
    height: 48,
    justifyContent: 'center',
    width: 48,
    left: 10,
    top: 4,
  },
  titleContainer: {
    alignSelf: 'flex-start',
  },
});
