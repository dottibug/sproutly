import { Pressable, View, Text, StyleSheet, Modal, ScrollView, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../styles/theme';
import IconButton from './buttons/IconButton';
import Heading from './Heading';

type SheetModalProps = {
  readonly accessibilityLabel: string;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly open: boolean;
  readonly showTrigger?: boolean;
  readonly onPressTrigger: () => void;
  readonly onRequestClose: () => void;
};

const SHEET_MAX_RATIO = 0.88;
const SHEET_HEADER_AREA = 56;

export default function SheetModal({
  accessibilityLabel,
  title,
  children,
  open,
  showTrigger,
  onPressTrigger,
  onRequestClose,
}: SheetModalProps) {
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  const sheetMaxHeight = windowHeight * SHEET_MAX_RATIO;
  const scrollMaxHeight = Math.max(160, sheetMaxHeight - SHEET_HEADER_AREA - Math.max(16, insets.bottom));

  return (
    <>
      {showTrigger && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ expanded: open }}
          onPress={onPressTrigger}
          style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}>
          <Text style={styles.triggerTitle}>{title}</Text>
        </Pressable>
      )}

      <Modal visible={open} transparent animationType="slide" onRequestClose={onRequestClose}>
        <View style={styles.modalRoot}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onRequestClose} accessibilityLabel="Dismiss filters" />
          <View
            style={[
              styles.sheet,
              {
                paddingBottom: Math.max(16, insets.bottom),
                maxHeight: sheetMaxHeight,
              },
            ]}>
            <View style={styles.sheetHeader}>
              <Heading size="small">{title}</Heading>
            </View>
            <Pressable
              style={styles.closeButton}
              onPress={onRequestClose}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Done">
              <IconButton icon="close" size={24} onPress={onRequestClose} />
            </Pressable>
            <ScrollView
              style={[styles.sheetScroll, { maxHeight: scrollMaxHeight }]}
              contentContainerStyle={styles.sheetScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator>
              <View style={styles.content}>{children}</View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: '#f5f5f5',
    paddingBottom: 9,
    paddingTop: 18,
    paddingHorizontal: 16,
  },
  triggerPressed: {
    opacity: 0.85,
  },
  triggerTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.opaqueBlack,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1000,
  },
  sheet: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: '#ccc',
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: 42,
    paddingHorizontal: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    maxWidth: '85%',
    minHeight: 44,
  },
  doneButton: {
    color: colors.hunterGreen,
    fontSize: 16,
    fontWeight: '600',
  },
  sheetScroll: {},
  sheetScrollContent: {
    paddingBottom: 8,
  },
  content: {
    flexDirection: 'column',
    gap: 6,
  },
});
