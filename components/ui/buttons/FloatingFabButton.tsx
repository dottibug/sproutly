import { Platform, StyleSheet } from 'react-native';
import { FAB as PaperFAB } from 'react-native-paper';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { colors } from '../../../styles/theme';

// FABButton.tsx: Renders an absolutely positioned FAB button with an icon. Used for any FAB button in the app. Parent view must have position: relative.

type FabButtonProps = {
  readonly iconName: 'calendar-plus' | 'sticky-note' | 'camera' | 'plus';
  readonly iconSize: number;
  readonly accessibilityLabel: string;
  readonly bottomInset: number;
  readonly onPress: () => void;
};

export default function FabButton({ iconName, iconSize, accessibilityLabel, bottomInset, onPress }: FabButtonProps) {
  function fabIcon() {
    return <FontAwesome5 name={iconName} size={iconSize} color={colors.white} solid />;
  }
  return (
    <PaperFAB
      accessibilityLabel={accessibilityLabel}
      icon={fabIcon}
      style={[
        styles.fab,
        {
          backgroundColor: colors.gray600,
          bottom: 18,
          right: 16,
        },
      ]}
      color={colors.white}
      onPress={onPress}
    />
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  fab: {
    borderRadius: 100,
    padding: 4,
    position: 'absolute',
  },
});
