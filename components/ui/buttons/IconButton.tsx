import { Pressable, StyleProp, ViewStyle } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '../../../styles/theme';

// IconButton.tsx: Reusable icon button component.

type IconButtonProps = {
  readonly icon: 'info' | 'close' | 'closeCircle' | 'plus' | 'pencil' | 'xmark' | 'chevronRight' | 'heart' | 'heartOutline' | 'calender';
  readonly size?: number;
  readonly color?: string;
  readonly onPress: () => void;
  readonly customStyles?: StyleProp<ViewStyle>;
  readonly hitSlop?: number;
};

export default function IconButton({ icon, size = 24, color = colors.primary, onPress, customStyles, hitSlop }: IconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={customStyles}
      hitSlop={hitSlop ? { top: hitSlop, bottom: hitSlop, left: hitSlop, right: hitSlop } : undefined}>
      {icon === 'info' && <MaterialCommunityIcons name="information-variant-circle-outline" size={size} color={color} />}
      {icon === 'close' && <FontAwesome6 name="xmark" size={size} color={color} />}
      {icon === 'closeCircle' && <FontAwesome6 name="circle-xmark" size={size} color={color} />}
      {icon === 'plus' && <FontAwesome6 name="plus" size={size} color={color} />}
      {icon === 'pencil' && <FontAwesome6 name="pencil" size={size} color={color} />}
      {icon === 'xmark' && <FontAwesome6 name="xmark" size={size} color={color} />}
      {icon === 'chevronRight' && <FontAwesome6 name="chevron-right" size={size} color={color} />}
      {icon === 'heart' && <MaterialCommunityIcons name="cards-heart" size={size} color={color} />}
      {icon === 'heartOutline' && <MaterialCommunityIcons name="cards-heart-outline" size={size} color={color} />}
      {icon === 'calender' && <FontAwesome5 name="calendar" size={size} color={color} />}
    </Pressable>
  );
}

// const styles = StyleSheet.create({
//   iconButton: {
//     borderWidth: 1,
//     borderColor: 'red',
//   },
// });
