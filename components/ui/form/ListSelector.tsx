import { View, StyleSheet } from 'react-native';
import Heading from '../Heading';
import { RadioButton } from 'react-native-paper';
import { colors } from '../../../styles/theme';
import IconButton from '../buttons/IconButton';

// ListSelector.tsx: Radio button list used to select an option from a list of options. Used in CustomSeedSheet.tsx when creating a custom seed.

type ListSelectorProps = {
  readonly title: string;
  readonly value: any;
  readonly onValueChange: (value: any) => void;
  readonly options: { value: string; label: string }[];
  readonly showInfoIcon?: boolean;
  readonly onIconPress?: () => void;
};

export default function ListSelector({ title, value, onValueChange, options, showInfoIcon = false, onIconPress }: ListSelectorProps) {
  // Label styles based on selected value
  const getLabelStyles = (option: string, selected: string) =>
    StyleSheet.flatten([styles.radioItemLabel, { color: option === selected ? colors.white : colors.gray600 }]);

  // Get background color of the ratio item based on selected value
  const getItemStyles = (option: string, selected: string) =>
    StyleSheet.flatten([styles.radioItem, { backgroundColor: option === selected ? colors.greenLight : colors.white }]);

  return (
    <View style={styles.listSelectorContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={styles.labelContainerRow}>
          {showInfoIcon && <IconButton icon="info" size={24} color={colors.gray600} onPress={onIconPress || (() => {})} />}
          <Heading size="xsmall">{title}</Heading>
        </View>
      </View>
      <View style={styles.radioGroupWrapper}>
        <RadioButton.Group value={value} onValueChange={onValueChange}>
          {options.map((option) => (
            <RadioButton.Item
              key={option.value}
              label={option.label}
              value={option.value}
              color={colors.gray100}
              rippleColor="transparent"
              labelStyle={getLabelStyles(option.value, value)}
              style={getItemStyles(option.value, value)}
              labelVariant="bodySmall"
              mode="ios"
              uncheckedColor={colors.greenLight}
              position="leading"
            />
          ))}
        </RadioButton.Group>
      </View>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  listSelectorContainer: {
    gap: 8,
  },
  labelContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioGroupWrapper: {
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  radioItem: {
    borderColor: colors.gray300,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: 4,
    paddingLeft: 6,
  },
  radioItemLabel: {
    fontSize: 16,
    textAlign: 'left',
    marginLeft: 12,
  },
});
