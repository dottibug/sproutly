import { View, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import Heading from '../Heading';
import { colors } from '../../../styles/theme';
import IconButton from '../buttons/IconButton';

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
  const buttons = options.map((option) => {
    return { value: option.value, label: option.label, disabled: disabled };
  });

  const headingStyles = disabled ? { color: colors.lightGray } : { color: colors.primary };

  return (
    <View style={styles.selectorContainer}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Heading size="xsmall" customStyles={headingStyles}>
          {title}
        </Heading>
        {showInfoIcon && <IconButton icon="info" onPress={onIconPress || (() => {})} />}
      </View>
      <SegmentedButtons value={value} onValueChange={onValueChange} buttons={buttons} />
    </View>
  );
}

const styles = StyleSheet.create({
  selectorContainer: {
    gap: 8,
  },
});
