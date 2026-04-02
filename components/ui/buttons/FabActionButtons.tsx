import { Platform, StyleSheet } from 'react-native';
import { FAB as PaperFAB, Portal } from 'react-native-paper';
import { colors } from '../../../styles/theme';

// FabActionButtons.tsx: Renders the FAB action buttons for the app. Used for the FAB menu in the app.

type FabActionButtonsProps = {
  readonly open: boolean;
  readonly setFabOpen: (open: boolean) => void;
  readonly onAddCustomSeed: () => void;
  readonly onBrowse: () => void;
  readonly bottomInset: number;
  readonly showFabActions: boolean;
};

export default function FabActionButtons({
  open,
  setFabOpen,
  onAddCustomSeed,
  onBrowse,
  bottomInset,
  showFabActions,
}: FabActionButtonsProps) {
  return (
    <Portal>
      <PaperFAB.Group
        actions={[
          {
            icon: 'seed',
            label: 'Add Custom Seed',
            onPress: onAddCustomSeed,
            style: styles.fab,
            color: colors.gray200,
            wrapperStyle: styles.wrapperStyle,
            containerStyle: styles.containerStyle,
            labelStyle: styles.labelStyle,
          },
          {
            icon: 'book-open-page-variant',
            label: 'Browse Seeds to Add',
            onPress: onBrowse,
            style: styles.fab,
            color: colors.gray200,
            wrapperStyle: styles.wrapperStyle,
            containerStyle: styles.containerStyle,
            labelStyle: styles.labelStyle,
          },
        ]}
        icon={open ? 'close' : 'plus'}
        open={open}
        onStateChange={({ open }) => setFabOpen(open)}
        fabStyle={[styles.mainFab, { bottom: bottomInset, marginTop: Platform.OS === 'ios' ? 24 : 20 }]}
        color={colors.gray200}
        style={[styles.groupStyle, { bottom: Platform.OS === 'ios' ? 18 : 56 - bottomInset }]}
        visible={showFabActions}
      />
    </Portal>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  groupStyle: {},
  mainFab: {
    backgroundColor: colors.gray600,
    borderRadius: 100,
    color: colors.gray200,
    marginTop: 28,
    padding: 4,
  },
  fab: {
    backgroundColor: colors.gray600,
    borderRadius: 100,
    padding: 4,
  },
  wrapperStyle: {},
  containerStyle: {
    marginRight: 8,
  },
  labelStyle: {
    fontSize: 16,
  },
});

// ---- REFERENCES ----
// https://oss.callstack.com/react-native-paper/docs/components/FAB/FABGroup#labelstyle
