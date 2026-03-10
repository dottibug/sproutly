import { View, StyleSheet } from 'react-native';
import { SeedType, Exposure } from '../../lib/types';
import Badge from '../ui/Badge';
import { colors, seedTypeColorMap } from '../../styles/theme';

type SeedBadgesProps = {
  readonly type: SeedType;
  readonly exposure: Exposure;
  readonly inUserCollection: boolean;
};

export default function SeedBadges({ type, exposure, inUserCollection }: SeedBadgesProps) {
  return (
    <View style={styles.badges}>
      {inUserCollection && <Badge type="detail" text="In My Seeds" color={colors.dusk} width={110} />}
      <Badge type="detail" text={type} color={seedTypeColorMap[type]} width={96} />
      <Badge type="detail" text={exposure} color={colors.yellow} width={exposure === 'Full sun to part shade' ? 180 : 100} />
    </View>
  );
}

const styles = StyleSheet.create({
  badges: {
    alignItems: 'center',
    borderColor: '#ccc',
    flexDirection: 'row',
    gap: 8,
  },
  seedTypeAndExposure: {
    alignItems: 'center',
    borderColor: '#ccc',
    borderTopWidth: 1,
    flexDirection: 'row',
  },
});
