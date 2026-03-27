import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';
import { BUTTON_COLOR_MAP } from './AppButton';

const iconSizeMap = {
  xsmall: 14,
  small: 16,
  medium: 18,
  large: 20,
};

type AppButtonIconProps = {
  readonly icon: 'add' | 'delete' | 'cancel';
  readonly size?: 'xsmall' | 'small' | 'medium' | 'large';
  readonly color?: 'primary' | 'secondary' | 'danger';
  readonly variant?: 'solid' | 'outline';
};

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

// Renders one of these icons on a button: add, delete, cancel
export default function AppButtonIcon({ icon, size = 'medium', color = 'primary', variant = 'solid' }: AppButtonIconProps) {
  const iconMap: Record<string, IconName> = {
    add: 'plus-thick',
    delete: 'trash-can',
    cancel: 'close-thick',
  };

  const iconColor = variant === 'solid' ? 'white' : BUTTON_COLOR_MAP[color];

  return <MaterialCommunityIcons name={iconMap[icon]} size={iconSizeMap[size]} color={iconColor} />;
}
