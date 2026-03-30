import { View, StyleSheet } from 'react-native';
import { Category, Exposure } from '../../state/userSeeds/seeds/seedInfoTypes';
import Heading from '../ui/Heading';
import SeedSKU from './SeedSku';
import SeedBadges from './SeedBadges';

// SeedHeader.tsx: Displays the header of the 'Seed Details' screen

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

// ---- STYLES ----
const styles = StyleSheet.create({
  edgePadding: {
    padding: 16,
  },
  addButtonContainer: {
    marginTop: 16,
  },
});
