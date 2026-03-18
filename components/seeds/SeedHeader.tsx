import { View, StyleSheet } from 'react-native';
import Heading from '../ui/Heading';
import { SeedType, Exposure } from '../../utils/types';
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
  readonly exposure: Exposure;
};

// SeedHeader component displays the header of a single seed in the user's collection or the browse list
export default function SeedHeader({ name, category, beanType, seedSKU, catalogId, inUserCollection, type, exposure }: SeedHeaderProps) {
  return (
    <View style={styles.edgePadding}>
      <Heading size="large">
        {name} {category} {beanType ? `(${beanType})` : ''}
      </Heading>
      <SeedSKU seedSKU={seedSKU} catalogId={catalogId} />
      <SeedBadges type={type} exposure={exposure} inUserCollection={inUserCollection} />
    </View>
  );
}

const styles = StyleSheet.create({
  edgePadding: {
    padding: 16,
  },
  addButtonContainer: {
    marginTop: 16,
  },
});
