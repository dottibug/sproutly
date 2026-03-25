import { Pressable, Text, StyleSheet } from 'react-native';
import AppButtonIcon from './AppButtonIcon';
import { colors } from '../../../styles/theme';

type ButtonColor = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'xsmall' | 'small' | 'medium' | 'large';
type ButtonVariant = 'solid' | 'outline';
type ButtonIcon = 'add' | 'delete' | 'cancel';

type AppButtonProps = {
  readonly text: string;
  readonly onPress: () => void;
  readonly color?: ButtonColor;
  readonly size?: ButtonSize;
  readonly variant?: ButtonVariant;
  readonly icon?: ButtonIcon | null;
  readonly width?: any;
  readonly disabled?: boolean;
  readonly uppercase?: boolean;
  readonly rounded?: boolean;
  readonly customColor?: string | null;
  readonly transparent?: boolean;
};

// Button component to render any of the app button styles. Default is a solid hunter green button that takes up the full width of the parent container.
export default function AppButton({
  text,
  onPress,
  color = 'primary',
  size = 'medium',
  variant = 'solid',
  icon = null,
  width = 'auto%',
  disabled = false,
  uppercase = false,
  rounded = false,
  customColor = null,
  transparent = false,
}: AppButtonProps) {
  const hasIcon = icon !== null && icon !== undefined;

  const buttonColor = () => {
    if (variant === 'outline') return transparent ? 'transparent' : colors.white;
    return customColor || BUTTON_COLOR_MAP[color];
  };

  const buttonTextColor = () => {
    if (variant === 'solid') return colors.white;
    return customColor || BUTTON_COLOR_MAP[color];
  };

  const buttonStyles = [
    styles.button,
    {
      backgroundColor: buttonColor(),
      borderColor: customColor || BUTTON_COLOR_MAP[color],
      borderRadius: rounded ? 100 : 0,
      padding: PADDING_MAP[size],
      width,
    },
  ];

  const buttonPressedStyles = [...buttonStyles, { opacity: 0.8 }];
  const buttonDisabledStyles = [...buttonStyles, { opacity: 0.6 }];

  const buttonTextStyles = [
    styles.buttonText,
    {
      color: buttonTextColor(),
      textTransform: uppercase ? ('uppercase' as const) : ('none' as const),
      fontSize: FONT_SIZE_MAP[size],
      lineHeight: LINE_HEIGHT_MAP[size],
    },
  ];

  const getButtonStyles = (pressed: boolean) => {
    if (pressed) return buttonPressedStyles;
    if (disabled) return buttonDisabledStyles;
    return buttonStyles;
  };

  return (
    <Pressable style={({ pressed }) => getButtonStyles(pressed)} onPress={onPress} disabled={disabled}>
      {hasIcon && <AppButtonIcon icon={icon} size={size} variant={variant} color={color} />}
      <Text style={buttonTextStyles}>{text}</Text>
    </Pressable>
  );
}

const FONT_SIZE_MAP = {
  xsmall: 16,
  small: 18,
  medium: 20,
  large: 22,
};

const LINE_HEIGHT_MAP = {
  xsmall: 18,
  small: 20,
  medium: 22,
  large: 24,
};

const PADDING_MAP = {
  xsmall: 6,
  small: 8,
  medium: 10,
  large: 12,
};

const BUTTON_COLOR_MAP = {
  primary: colors.greenMedium,
  secondary: colors.mediumGray,
  danger: colors.red,
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderWidth: 2,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 500,
  },
});
