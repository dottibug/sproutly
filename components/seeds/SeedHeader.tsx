import { View, StyleSheet } from 'react-native';
import Heading from '../ui/Heading';
import { Category, Exposure } from '../../state/userSeeds/seeds/seedInfoTypes';
import SeedSKU from './SeedSku';
import SeedBadges from './SeedBadges';

type SeedHeaderProps = {
  readonly variety: string;
  readonly plant: string;
  readonly beanType: string | null;
  readonly seedSKU: string | null;
  readonly catalogId: string;
  readonly inUserCollection: boolean;
  readonly category: Category;
  readonly exposure: Exposure;
};

// SeedHeader component displays the header of a single seed in the user's collection or the browse list
export default function SeedHeader({
  variety,
  plant,
  beanType,
  seedSKU,
  catalogId,
  inUserCollection,
  category,
  exposure,
}: SeedHeaderProps) {
  return (
    <View style={styles.edgePadding}>
      <Heading size="large">
        {variety} {plant} {beanType ? `(${beanType})` : ''}
      </Heading>
      <SeedSKU seedSKU={seedSKU} catalogId={catalogId} />
      <SeedBadges category={category} exposure={exposure} inUserCollection={inUserCollection} />
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
