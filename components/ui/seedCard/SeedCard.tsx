import { View, StyleSheet, Pressable } from 'react-native';
import SeedCardImage from './SeedCardImage';
import type { SeedCatalogItem, UserSeedItem } from '../../../lib/seedCatalog';
import SeedCardInfo from './SeedCardInfo';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type SeedCardProps = {
  readonly cardType: 'user' | 'catalog';
  readonly seed: UserSeedItem | SeedCatalogItem;
  readonly onPress: () => void;
};

// TODO: decide how to include an "add seed" button on the catalog cards (and a remove seed on the user cards)
// TODO: should the catalog cards include a way to show that this seed is in the user's collection?
// TODO: should the user cards include a way to show sun exposure and other seed details? Maybe the user can choose between basic and detailed seed cards in their collection (in the user settings page, or on the seed list page itself?)
// TODO: might be able to delete cardType prop (wait until after you've figured out the basic/detailed user seed cards)

export default function SeedCard({ cardType, seed, onPress }: SeedCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <SeedCardImage imageUri={seed.image} />
        <SeedCardInfo name={seed.name} category={seed.category} beanType={seed.bean_type} type={seed.type} />
      </View>
      <View style={styles.seedDetailsButton}>
        <Pressable onPress={onPress}>
          <FontAwesome name="angle-right" size={32} color="black" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    marginBottom: 12,
    padding: 8,
    paddingBottom: 16,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  seedDetailsButton: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 8,
    width: 48,
  },
});
