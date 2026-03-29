import { Text, StyleSheet, FlatList, Pressable, Image, Dimensions, View } from 'react-native';
import { useState, useMemo, useCallback } from 'react';
import { Stack } from 'expo-router';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { GalleryCell } from '../../state/userSeeds/photos/photoTypes';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import { flattenPhotos } from '../../state/userSeeds/photos/photoUtils';
import Loading from '../../components/ui/Loading';
import ScreenMessage from '../../components/ui/ScreenMessage';
import GalleryModal from '../../components/gallery/GalleryModal';
import { colors } from '../../styles/theme';

// GalleryScreen.tsx: Displays all the user's photos in a 2x2 grid
export default function GalleryScreen() {
  const { seeds, loading, error } = useUserSeed();
  const [selected, setSelected] = useState<GalleryCell | null>(null);

  // Flatten photos into a single list of GalleryCells for the FlatList
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
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Photo Gallery', headerShown: true }} />
      <Text style={styles.subtitle}>Tap a photo for a larger view</Text>

      {!hasPhotos && <ScreenMessage message={NO_PHOTOS_MESSAGE} />}

      {hasPhotos && (
        <FlatList
          data={cells}
          keyExtractor={(item) => item.key}
          numColumns={2}
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
    </View>
  );
}

// ---- CONSTANTS ----
const GAP = 8;
const COLS = 2;
const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 16;
const CELL_SIZE = (SCREEN_WIDTH - PADDING * 2 - GAP) / COLS;
const NO_PHOTOS_MESSAGE = `No photos yet. Add photos in the 'Photos' tab of a seed.`;

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray200,
    flex: 1,
    paddingTop: PADDING,
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 16,
    marginBottom: 14,
    paddingHorizontal: PADDING,
  },
  list: {
    paddingBottom: 24,
    paddingHorizontal: PADDING,
  },
  row: {
    gap: GAP,
    marginBottom: GAP,
  },
  tile: {
    width: CELL_SIZE,
  },
  thumb: {
    backgroundColor: colors.gray300,
    borderRadius: 18,
    height: CELL_SIZE,
    width: CELL_SIZE,
  },
});
