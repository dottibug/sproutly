import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import type { SeedCatalogItem } from '../lib/seedCatalog';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SeedTypeIcon from './SeedTypeIcon';
import { useRouter } from 'expo-router';

type CatalogSeedCardProps = {
  readonly seed: SeedCatalogItem;
};

export default function CatalogSeedCard({ seed }: CatalogSeedCardProps) {
  const router = useRouter();
  const handlePress = () => router.push(`/catalog/${seed.id}`);

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        {/* Image */}
        <Image source={{ uri: seed.image }} style={styles.image} resizeMode="cover" />

        {/* Seed info */}
        <View style={styles.seedInfo}>
          <Text style={styles.name}>
            {seed.name} {seed.category} {seed.bean_type ? `(${seed.bean_type})` : ''}
          </Text>
          <View style={styles.seedType}>
            <SeedTypeIcon type={seed.type} size="small" />
          </View>
        </View>

        {/* Seed details nav */}
        <View style={styles.seedDetailsButton}>
          <Pressable onPress={handlePress}>
            <FontAwesome name="angle-right" size={32} color="black" />
          </Pressable>
        </View>
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
  image: {
    borderRadius: 9,
    height: 96,
    width: 96,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  seedInfo: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  seedType: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
    // marginTop: 'auto',
  },
  seedDetailsButton: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 8,
    width: 48,
  },
});
