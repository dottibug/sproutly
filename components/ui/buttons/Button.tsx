import { Pressable, Text, StyleSheet } from 'react-native';
import { buttonColorMap, colors } from '../../../styles/theme';
import ButtonIcon from './ButtonIcon';

const fontSizeMap = {
  small: 14,
  medium: 16,
  large: 18,
};

const lineHeightMap = {
  small: 18,
  medium: 20,
  large: 22,
};

const paddingMap = {
  small: 6,
  medium: 9,
  large: 12,
};

type ButtonProps = {
  readonly text: string;
  readonly onPress: () => void;
  readonly color?: 'primary' | 'secondary' | 'danger';
  readonly size?: 'small' | 'medium' | 'large';
  readonly variant?: 'solid' | 'outline';
  readonly icon?: 'add' | 'delete' | 'cancel' | null;
  readonly width?: any;
};

// Button component to render any of the app button styles. Default is a solid hunter green button that takes up the full width of the parent container.
export default function Button({
  text,
  onPress,
  color = 'primary',
  size = 'medium',
  variant = 'solid',
  icon = null,
  width = '100%',
}: ButtonProps) {
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
      {hasIcon && <ButtonIcon icon={icon} size={size} variant={variant} color={color} />}
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
