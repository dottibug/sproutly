import { useState, useMemo, useCallback } from 'react';
import { Text, StyleSheet, FlatList, Pressable, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import { GalleryCell } from '../../state/userSeeds/photos/photoTypes';
import Loading from '../../components/ui/Loading';
import ScreenMessage from '../../components/ui/ScreenMessage';
import { colors } from '../../styles/theme';
import { flattenPhotos } from '../../state/userSeeds/photos/photoUtils';
import GalleryModal from '../../components/gallery/GalleryModal';

const GAP = 8;
const COLS = 2;
const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 16;
const CELL_SIZE = (SCREEN_WIDTH - PADDING * 2 - GAP) / COLS;
const NO_PHOTOS_MESSAGE = 'No photos yet. Add photos from a seed’s Photos tab.';

export default function GalleryScreen() {
  const { seeds, loading, error } = useUserSeed();
  const [selected, setSelected] = useState<GalleryCell | null>(null);

  // Flatten photos into a single list of GalleryCells
  const cells = useMemo(() => flattenPhotos(seeds as UserSeed[]), [seeds]);

  const hasPhotos = cells.length > 0;

  // Check if a seed is in the user's collection
  const isSeedInCollection = useCallback((userSeedId: string) => (seeds as UserSeed[]).some((seed) => seed.id === userSeedId), [seeds]);

  if (loading) return <Loading message="Loading photos…" />;
  if (error) return <ScreenMessage message={error} />;

  // Render item for the FlatList
  const photoCell = ({ item }: { item: GalleryCell }) => (
    <Pressable style={styles.tile} onPress={() => setSelected(item)}>
      <Image source={{ uri: item.photo.imageUri }} style={styles.thumb} resizeMode="cover" />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Photo gallery</Text>
      <Text style={styles.subtitle}>Tap a photo for a larger view</Text>

      {!hasPhotos && <ScreenMessage message={NO_PHOTOS_MESSAGE} />}

      {hasPhotos && (
        <FlatList
          data={cells}
          keyExtractor={(item) => item.key}
          numColumns={COLS}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={photoCell}
        />
      )}

      <GalleryModal
        visible={selected !== null}
        onRequestClose={() => setSelected(null)}
        selected={selected}
        isSeedInCollection={isSeedInCollection(selected?.seed?.id ?? '')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: PADDING,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondary,
    paddingHorizontal: PADDING,
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: PADDING,
    paddingBottom: 24,
  },
  row: {
    gap: GAP,
    marginBottom: GAP,
  },
  tile: {
    width: CELL_SIZE,
  },
  thumb: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
  },
});
