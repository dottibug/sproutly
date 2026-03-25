import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type BadgeProps = {
  readonly type: 'card' | 'detail' | 'mini';
  readonly text: string;
  readonly color: string;
  readonly width: any;
};

// Badge component that applies styles based on type prop.
export default function Badge({ type, text, color, width = '100%' }: BadgeProps) {
  const badgeStyleMap = {
    card: styles.badgeStyleCard,
    detail: styles.badgeStyleDetail,
    mini: styles.badgeStyleMini,
  };

  const badgeTextMap = {
    card: styles.badgeTextCard,
    detail: styles.badgeTextDetail,
    mini: styles.badgeTextMini,
  };

  return (
    <View
      style={[
        badgeStyleMap[type],
        {
          borderColor: color,
          backgroundColor: colors.white,
          width,
        },
      ]}>
      {type === 'mini' && <MaterialCommunityIcons name="check-circle" size={16} color={colors.white} />}
      <Text style={[badgeTextMap[type], { color: color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeStyleCard: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    opacity: 0.8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeTextCard: {
    color: colors.white,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  badgeStyleDetail: {
    alignItems: 'center',
    borderRadius: 0,
    borderWidth: 2,
    opacity: 0.8,
    padding: 8,
  },
  badgeTextDetail: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  badgeStyleMini: {
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    opacity: 0.8,
    padding: 6,
  },
  badgeTextMini: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});
