import { Pressable, View, Text, StyleSheet, Modal, ScrollView, useWindowDimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
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

  const sheetContent = (
    <SafeAreaView
      style={[
        styles.sheet,
        {
          maxHeight: sheetMaxHeight,
        },
      ]}
      edges={['bottom']}>
      <View style={styles.sheetHeaderRow}>
        <Heading size="small">{title}</Heading>
        <Pressable onPress={onRequestClose} hitSlop={12} accessibilityRole="button" accessibilityLabel="Done">
          <IconButton icon="close" size={24} onPress={onRequestClose} />
        </Pressable>
      </View>

      <ScrollView
        style={[styles.sheetScroll, { maxHeight: scrollMaxHeight }]}
        contentContainerStyle={styles.sheetScrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}>
        <View style={styles.content}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <>
      {/* MODAL TRIGGER (if shown) */}
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

      {/* MODAL */}
      <Modal visible={open} transparent animationType="slide" presentationStyle="overFullScreen" onRequestClose={onRequestClose}>
        <View style={styles.modalRoot}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onRequestClose} accessibilityLabel="Dismiss sheet" />
          {Platform.OS === 'android' ? (
            <KeyboardAvoidingView style={styles.kav} behavior="height">
              {sheetContent}
            </KeyboardAvoidingView>
          ) : (
            sheetContent
          )}
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
  kav: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  sheet: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderColor: '#ccc',
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: 16,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  sheetHeaderRow: {
    minHeight: 44,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  doneButton: {
    color: colors.hunterGreen,
    fontSize: 16,
    fontWeight: '600',
  },
  sheetScroll: {
    // Intentionally not flex:1 to support variable-height sheets.
  },
  sheetScrollContent: {
    paddingBottom: 8,
  },
  content: {
    flexDirection: 'column',
    gap: 6,
  },
});
