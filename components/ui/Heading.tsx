import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { colors } from '../../styles/theme';

type HeadingProps = {
  readonly children: React.ReactNode;
  readonly color?: 'primary' | 'secondary';
  readonly size?: 'xsmall' | 'small' | 'medium' | 'large';
  readonly marginVertical?: number;
  readonly uppercase?: boolean;
  readonly customStyles?: StyleProp<TextStyle>;
};

// Heading component that applies styles based on size and color props. Can be uppercase.
export default function Heading({
  children,
  color = 'primary',
  size = 'medium',
  marginVertical = 0,
  uppercase = false,
  customStyles,
}: HeadingProps) {
  const headingStyle = () => {
    let headingStyles = [];
    if (size === 'xsmall') headingStyles.push(styles.xsmallHeading);
    if (size === 'small') headingStyles.push(styles.smallHeading);
    if (size === 'medium') headingStyles.push(styles.mediumHeading);
    if (size === 'large') headingStyles.push(styles.largeHeading);
    if (color === 'primary') headingStyles.push(styles.primary);
    if (color === 'secondary') headingStyles.push(styles.secondary);
    if (uppercase) headingStyles.push(styles.uppercase);
    return headingStyles;
  };

  return <Text style={[headingStyle(), { marginTop: marginVertical, marginBottom: marginVertical }, customStyles]}>{children}</Text>;
}

const styles = StyleSheet.create({
  xsmallHeading: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  smallHeading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mediumHeading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  largeHeading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  primary: {
    color: colors.primary,
  },
  secondary: {
    color: colors.secondary,
  },
  uppercase: {
    textTransform: 'uppercase',
  },
});
