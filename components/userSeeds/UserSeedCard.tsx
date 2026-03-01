import type { UserSeedItem } from '../../lib/seedCatalog';
import { StyleSheet } from 'react-native';
import SeedCard from '../ui/seedCard/SeedCard';

type UserSeedCardProps = {
  readonly seed: UserSeedItem;
};

// TODO enable basic and detailed versions (user preferences setting probably)
export default function UserSeedCard({ seed }: UserSeedCardProps) {
  const handlePress = () => {
    console.log('User seed card pressed');
  };

  return <SeedCard cardType="user" seed={seed} onPress={handlePress} />;
}

const styles = StyleSheet.create({});
