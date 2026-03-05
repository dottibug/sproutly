import { useLocalSearchParams } from 'expo-router';
import SeedDetails from '../../../components/seedDetails/SeedDetails';
import { useUserSeeds } from '../../../lib/contexts/UserSeedsContext';
import ScreenMessage from '../../../components/ui/ScreenMessage';
import ScreenContainer from '../../../components/ui/ScreenContainer';

export default function UserSeedDetailsScreen() {
  const { id, source } = useLocalSearchParams();
  const { seeds } = useUserSeeds();

  const seed = seeds.find((s) => {
    if (source === 'catalog') return s.catalog_seed_id === id;
    if (source === 'custom') return s.custom_seed_id === id;
    return false;
  });

  if (!seed) {
    return (
      <ScreenContainer>
        <ScreenMessage message="Seed not found" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer fullScreen>
      <SeedDetails seed={seed} />
    </ScreenContainer>
  );
}
