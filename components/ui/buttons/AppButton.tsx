import { Pressable, Text, StyleSheet } from 'react-native';
import { buttonColorMap, colors } from '../../../styles/theme';
import AppButtonIcon from './AppButtonIcon';

const fontSizeMap = {
  xsmall: 12,
  small: 14,
  medium: 16,
  large: 18,
};

const lineHeightMap = {
  xsmall: 16,
  small: 18,
  medium: 20,
  large: 22,
};

const paddingMap = {
  xsmall: 4,
  small: 6,
  medium: 9,
  large: 12,
};

type AppButtonProps = {
  readonly text: string;
  readonly onPress: () => void;
  readonly color?: 'primary' | 'secondary' | 'danger';
  readonly size?: 'xsmall' | 'small' | 'medium' | 'large';
  readonly variant?: 'solid' | 'outline';
  readonly icon?: 'add' | 'delete' | 'cancel' | null;
  readonly width?: any;
};

// Button component to render any of the app button styles. Default is a solid hunter green button that takes up the full width of the parent container.
export default function AppButton({
  text,
  onPress,
  color = 'primary',
  size = 'medium',
  variant = 'solid',
  icon = null,
  width = 'auto',
}: AppButtonProps) {
  const hasIcon = icon !== null;

  const buttonColor = variant === 'solid' ? buttonColorMap[color] : colors.white;

  const buttonTextColor = variant === 'outline' ? buttonColorMap[color] : colors.white;

  const buttonStyles = [
    styles.button,
    {
      backgroundColor: buttonColor,
      borderColor: buttonColorMap[color],
      padding: paddingMap[size],
      width,
    },
  ];

  const buttonPressedStyles = [...buttonStyles, { opacity: 0.8 }];

  return (
    <Pressable style={({ pressed }) => (pressed ? buttonPressedStyles : buttonStyles)} onPress={onPress}>
      {hasIcon && <AppButtonIcon icon={icon} size={size} variant={variant} color={color} />}
      <Text
        style={[
          styles.buttonText,
          {
            color: buttonTextColor,
            fontSize: fontSizeMap[size],
            lineHeight: lineHeightMap[size],
          },
        ]}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 2,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 18,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
