import { View, StyleSheet } from 'react-native';
import Heading from '../ui/Heading';
import type { SeedType, ExposureType } from '../../lib/seedCatalog';
import SeedSKU from './SeedSku';
import SeedBadges from './SeedBadges';

type SeedHeaderProps = {
  readonly name: string;
  readonly category: string;
  readonly beanType: string | null;
  readonly seedSKU: string | null;
  readonly catalogId: string;
  readonly inUserCollection: boolean;
  readonly type: SeedType;
  readonly exposure: ExposureType;
};

export default function SeedHeader({ name, category, beanType, seedSKU, catalogId, inUserCollection, type, exposure }: SeedHeaderProps) {
  return (
    <View style={styles.edgePadding}>
      <Heading size="large">
        {name} {category} {beanType ? `(${beanType})` : ''}
      </Heading>
      <SeedSKU seedSKU={seedSKU} catalogId={catalogId} inUserCollection={inUserCollection} />
      <SeedBadges type={type} exposure={exposure} />
    </View>
  );
}

const styles = StyleSheet.create({
  edgePadding: {
    padding: 16,
  },
});
