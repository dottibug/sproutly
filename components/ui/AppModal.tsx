import { Modal as RNModal, View, StyleSheet, useWindowDimensions } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '../../styles/theme';

type ModalProps = {
  readonly visible: boolean;
  readonly children: React.ReactNode;
  readonly onRequestClose: () => void;
  readonly animationType?: 'slide' | 'fade' | 'none';
};

// TODO: styling

export default function AppModal({ visible, children, onRequestClose, animationType = 'none' }: ModalProps) {
  const maxHeight = useWindowDimensions().height * 0.8;
  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top']}>
        <RNModal visible={visible} onRequestClose={onRequestClose} animationType={animationType} transparent={true}>
          <View style={styles.centered}>
            <View style={[styles.modalContent, { maxHeight }]}>{children}</View>
          </View>
        </RNModal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    // flex: 1,
    backgroundColor: colors.white,
    // margin: 20,
    borderWidth: 1,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
  },
});
