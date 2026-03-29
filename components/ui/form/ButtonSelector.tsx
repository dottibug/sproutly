import { View, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import Heading from '../Heading';
import IconButton from '../buttons/IconButton';
import { colors } from '../../../styles/theme';

// ButtonSelector.tsx: Segmented button selector used to select an option from a list of options. Used in CustomSeedSheet.tsx when creating a custom seed. Should only be used for 2 to 4 options.

type SelectorProps = {
  readonly disabled?: boolean;
  readonly title: string;
  readonly options: { value: string; label: string }[];
  readonly value: string;
  readonly onValueChange: (value: string) => void;
  readonly showInfoIcon?: boolean;
  readonly onIconPress?: () => void;
};

export default function Selector({
  disabled = false,
  title,
  options,
  value,
  onValueChange,
  showInfoIcon = false,
  onIconPress,
}: SelectorProps) {
  const buttonStyle = (optionValue: string) =>
    StyleSheet.flatten([
      {
        backgroundColor: value === optionValue && !disabled ? colors.greenDark90 : colors.white,
      },
      styles.buttonStyle,
    ]);

  const buttons = options.map((option) => ({
    value: option.value,
    label: option.label,
    disabled,
    accessibilityLabel: option.label,
    checkedColor: colors.white,
    uncheckedColor: colors.gray700,
    showSelectedCheck: !disabled,
    style: buttonStyle(option.value),
  }));

  const headingStyles = disabled ? { color: colors.gray300 } : { color: colors.primary };

  return (
    <View style={styles.selectorContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Heading size="xsmall" customStyles={headingStyles}>
          {title}
        </Heading>
        {showInfoIcon && <IconButton icon="info" onPress={onIconPress || (() => {})} />}
      </View>
      <SegmentedButtons value={value} onValueChange={onValueChange} buttons={buttons} density="small" />
    </View>
  );
}

const styles = StyleSheet.create({
  selectorContainer: {
    gap: 8,
  },
  buttonStyle: {
    borderWidth: 1,
    borderColor: colors.gray300,
  },
});
