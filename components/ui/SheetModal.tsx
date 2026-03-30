import { Pressable, View, Text, StyleSheet, Modal, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFilters } from '../../state/filters/FiltersContext';
import { getNumberOfSelectedFilters } from '../../state/filters/filterUtils';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import IconButton from './buttons/IconButton';
import Heading from './Heading';
import { colors } from '../../styles/theme';

// SheetModal.tsx: Displays a bottom sheet modal for the user to filter seeds.

type SheetModalProps = {
  readonly accessibilityLabel: string;
  readonly title: string;
  readonly children: React.ReactNode;
  readonly open: boolean;
  readonly showTrigger?: boolean;
  readonly onPressTrigger: () => void;
  readonly onRequestClose: () => void;
};

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
  const showTriggerRow = showTrigger !== false;
  const { selected, clearAllSelected } = useFilters();
  const hasSelectedFilters = getNumberOfSelectedFilters(selected) > 0;

  return (
    <>
      {showTriggerRow && (
        <View style={styles.triggerRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ expanded: open }}
            onPress={onPressTrigger}
            style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}>
            <View style={styles.triggerHeader}>
              <FontAwesome6 name="sliders" size={18} color={colors.primary} />
              <Heading size="medium" customStyles={{ color: colors.primary }}>
                {title}
              </Heading>
            </View>
          </Pressable>
          {hasSelectedFilters && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear all filters"
              onPress={clearAllSelected}
              style={({ pressed }) => [styles.clearTrigger, pressed && styles.clearTriggerPressed]}>
              <Text style={styles.clearTriggerText}>Clear Filters</Text>
            </Pressable>
          )}
        </View>
      )}
      <Modal visible={open} transparent animationType="slide" presentationStyle="overFullScreen" onRequestClose={onRequestClose}>
        <View style={styles.modalRoot}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onRequestClose} accessibilityLabel="Dismiss sheet" />
          <SafeAreaView style={[styles.sheet, { maxHeight: sheetMaxHeight }]} edges={['bottom']}>
            <View style={styles.sheetHeaderRow}>
              <Heading size="medium">{title}</Heading>
              <Pressable onPress={onRequestClose} accessibilityRole="button" accessibilityLabel="Done" style={styles.closeButton}>
                <IconButton icon="close" size={24} onPress={onRequestClose} color={colors.primary} />
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
        </View>
      </Modal>
    </>
  );
}

// ---- CONSTANTS ----
const SHEET_MAX_RATIO = 0.88;
const SHEET_HEADER_AREA = 56;

// ---- STYLES ----
const styles = StyleSheet.create({
  triggerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    paddingVertical: 18,
    gap: 12,
  },
  trigger: {
    backgroundColor: colors.white,
    flexShrink: 0,
  },
  triggerPressed: {
    opacity: 0.85,
  },
  clearTrigger: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  clearTriggerPressed: {
    opacity: 0.6,
  },
  clearTriggerText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.dusk,
    textTransform: 'uppercase',
  },
  triggerHeader: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.blackSheer75,
    position: 'relative',
  },
  sheet: {
    width: '100%',
    backgroundColor: colors.white,
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
    paddingHorizontal: 16,
  },
  closeButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetScroll: {
    // Intentionally not flex:1 to allow for variable-height sheets.
  },
  sheetScrollContent: {
    paddingBottom: 8,
  },
  content: {
    flexDirection: 'column',
    gap: 6,
  },
});
