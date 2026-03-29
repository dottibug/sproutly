import { Pressable } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '../../../styles/theme';

// IconButton.tsx: Reusable icon button component. Currently has info, close, and close circle icons.

type IconButtonProps = {
  readonly icon: 'info' | 'close' | 'closeCircle' | 'plus' | 'pencil' | 'xmark' | 'chevronRight' | 'heart' | 'heartOutline';
  readonly size?: number;
  readonly color?: string;
  readonly onPress: () => void;
};

export default function IconButton({ icon, size = 24, color = colors.primary, onPress }: IconButtonProps) {
  return (
    <Pressable onPress={onPress}>
      {icon === 'info' && <MaterialCommunityIcons name="information-variant-circle-outline" size={size} color={color} />}
      {icon === 'close' && <FontAwesome6 name="xmark" size={size} color={color} />}
      {icon === 'closeCircle' && <FontAwesome6 name="circle-xmark" size={size} color={color} />}
      {icon === 'plus' && <FontAwesome6 name="plus" size={size} color={color} />}
      {icon === 'pencil' && <FontAwesome6 name="pencil" size={size} color={color} />}
      {icon === 'xmark' && <FontAwesome6 name="xmark" size={size} color={color} />}
      {icon === 'chevronRight' && <FontAwesome6 name="chevron-right" size={size} color={color} />}
      {icon === 'heart' && <MaterialCommunityIcons name="cards-heart" size={24} color={color} />}
      {icon === 'heartOutline' && <MaterialCommunityIcons name="cards-heart-outline" size={24} color={color} />}
    </Pressable>
  );
}
