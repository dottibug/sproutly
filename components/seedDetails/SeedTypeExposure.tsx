import { View, StyleSheet } from 'react-native';
import SeedTypeIcon from '../ui/SeedTypeIcon';
import Exposure, { exposureType } from './Exposure';
import type { SeedType } from '../../lib/seedCatalog';

type SeedTypeExposureProps = {
  readonly type: SeedType;
  readonly exposure: exposureType;
};

export default function SeedTypeExposure({ type, exposure }: SeedTypeExposureProps) {
  return (
    <View style={styles.seedTypeAndExposure}>
      <SeedTypeIcon type={type} size="medium" />
      <Exposure exposure={exposure} />
    </View>
  );
}

const styles = StyleSheet.create({
  seedTypeAndExposure: {
    alignItems: 'center',
    borderColor: '#ccc',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingVertical: 18,
  },
});
