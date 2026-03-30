import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { headingSizeMap, text, colors } from '../../styles/theme';

// Heading.tsx: Renders a heading with a size and color. Can be uppercase. Can pass in custom styles.

type HeadingProps = {
  readonly children: React.ReactNode;
  readonly color?: 'primary' | 'secondary';
  readonly size?: 'xsmall' | 'small' | 'medium' | 'large';
  readonly uppercase?: boolean;
  readonly customStyles?: StyleProp<TextStyle>;
};

export default function Heading({ children, color = 'primary', size = 'medium', uppercase = false, customStyles }: HeadingProps) {
  const headingStyles: StyleProp<TextStyle> = StyleSheet.flatten([
    headingSizeMap[size],
    { color: color === 'primary' ? colors.primary : colors.secondary },
    uppercase && text.uppercase,
    customStyles,
  ]);
  return <Text style={headingStyles}>{children}</Text>;
}
