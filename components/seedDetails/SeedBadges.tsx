import { View, StyleSheet } from 'react-native';
import type { SeedType, ExposureType } from '../../lib/seedCatalog';
import Badge from '../ui/Badge';
import { colors, seedTypeColorMap } from '../../styles/theme';

type SeedBadgesProps = {
  readonly type: SeedType;
  readonly exposure: ExposureType;
};

export default function SeedBadges({ type, exposure }: SeedBadgesProps) {
  return (
    <View style={styles.badges}>
      <Badge type="detail" text={type} color={seedTypeColorMap[type]} width={96} />

      <Badge type="detail" text={exposure} color={colors.yellow} width={exposure === 'Full sun to part shade' ? 180 : 100} />
    </View>
  );
}

const styles = StyleSheet.create({
  badges: {
    alignItems: 'center',
    borderColor: '#ccc',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: 'row',
    marginBottom: 18,
    paddingVertical: 18,
    gap: 8,
  },
  seedTypeAndExposure: {
    alignItems: 'center',
    borderColor: '#ccc',
    borderTopWidth: 1,
    flexDirection: 'row',
  },
});
