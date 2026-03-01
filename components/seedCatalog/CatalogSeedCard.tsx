import { useRouter } from 'expo-router';
import type { SeedCatalogItem } from '../../lib/seedCatalog';
import SeedCard from '../ui/seedCard/SeedCard';

type CatalogSeedCardProps = {
  readonly seed: SeedCatalogItem;
};

export default function CatalogSeedCard({ seed }: CatalogSeedCardProps) {
  const router = useRouter();
  const handlePress = () => router.push(`/catalog/${seed.id}`);

  return <SeedCard cardType="catalog" seed={seed} onPress={handlePress} />;
}
