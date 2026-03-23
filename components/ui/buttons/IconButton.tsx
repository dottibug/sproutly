import { Pressable } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { colors } from '../../../styles/theme';

type IconButtonProps = {
  readonly icon: 'info' | 'close';
  readonly size?: number;
  readonly color?: string;
  readonly onPress: () => void;
};

export default function IconButton({ icon, size = 24, color = colors.lavender, onPress }: IconButtonProps) {
  const iconMap = {
    info: 'circle-info',
    closeCircle: 'circle-xmark',
    close: 'xmark',
  };

  return (
    <Pressable onPress={onPress}>
      <FontAwesome6 name={iconMap[icon]} size={size} color={color} />
    </Pressable>
  );
}
