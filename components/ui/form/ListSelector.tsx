import { View, StyleSheet } from 'react-native';
import Heading from '../Heading';
import { RadioButton } from 'react-native-paper';
import { colors } from '../../../styles/theme';
import IconButton from '../buttons/IconButton';

type ListSelectorProps = {
  readonly title: string;
  readonly value: any;
  readonly onValueChange: (value: any) => void;
  readonly options: { value: string; label: string }[];
  readonly showInfoIcon?: boolean;
  readonly onIconPress?: () => void;
};

export default function ListSelector({ title, value, onValueChange, options, showInfoIcon = false, onIconPress }: ListSelectorProps) {
  return (
    <View style={styles.listSelectorContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Heading size="xsmall">{title}</Heading>
        {showInfoIcon && <IconButton icon="info" onPress={onIconPress || (() => {})} />}
      </View>
      <RadioButton.Group value={value} onValueChange={onValueChange}>
        {options.map((option) => (
          <RadioButton.Item
            key={option.value}
            label={option.label}
            value={option.value}
            style={{ backgroundColor: option.value === value ? colors.lightGray : colors.white }}
          />
        ))}
      </RadioButton.Group>
    </View>
  );
}

const styles = StyleSheet.create({
  listSelectorContainer: {
    gap: 8,
  },
});
