import { Pressable } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '../../../styles/theme';

type IconButtonProps = {
  readonly icon: 'info' | 'close' | 'closeCircle';
  readonly size?: number;
  readonly color?: string;
  readonly onPress: () => void;
};

export default function IconButton({ icon, size = 24, color = colors.primary, onPress }: IconButtonProps) {
  return (
    <Pressable onPress={onPress}>
      {icon === 'info' && (
        <MaterialCommunityIcons name="information-variant-circle-outline" size={size} color={color} />
      )}
      {icon === 'close' && <FontAwesome6 name="xmark" size={size} color={color} />}
      {icon === 'closeCircle' && <FontAwesome6 name="circle-xmark" size={size} color={color} />}
    </Pressable>
  );
}
