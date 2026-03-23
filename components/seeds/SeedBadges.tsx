import { View, StyleSheet } from 'react-native';
import { Category, Exposure } from '../../state/userSeeds/seeds/seedInfoTypes';
import Badge from '../ui/Badge';
import { colors, seedTypeColorMap } from '../../styles/theme';

type SeedBadgesProps = {
  readonly category: Category;
  readonly exposure: Exposure;
  readonly inUserCollection: boolean;
};

// SeedBadges component displays the badges for a single seed in the user's collection or the browse list
export default function SeedBadges({ category, exposure, inUserCollection }: SeedBadgesProps) {
  return (
    <View style={styles.badges}>
      {inUserCollection && <Badge type="detail" text="In My Seeds" color={colors.dusk} width={110} />}
      <Badge type="detail" text={category} color={seedTypeColorMap[category]} width={96} />
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
