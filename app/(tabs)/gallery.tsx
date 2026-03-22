import { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { UserSeed } from '../../state/userSeeds/types/seedTypes';
import { UserSeedPhoto } from '../../state/userSeeds/types/photoTypes';
import Loading from '../../components/ui/Loading';
import ScreenMessage from '../../components/ui/ScreenMessage';
import { colors, appStyles } from '../../styles/theme';
import Button from '../../components/ui/buttons/Button';

// TODO: REFACTOR for clarity
// TODO: style the modal with a close button in the corner, as expected.
// TODO: get rid of the background or adjust height on the modal so it's not as tall?

const GAP = 8;
const COLS = 2;
const SCREEN_W = Dimensions.get('window').width;
const SCREEN_H = Dimensions.get('window').height;
const PAD = 16;
const TILE = (SCREEN_W - PAD * 2 - GAP) / COLS;
const MODAL_IMAGE_MAX_H = SCREEN_H * 0.62;

type GalleryCell = {
  key: string;
  photo: UserSeedPhoto;
  seed: UserSeed;
};

function flattenPhotos(seeds: UserSeed[]): GalleryCell[] {
  const out: GalleryCell[] = [];
  for (const seed of seeds) {
    for (const photo of seed.photos ?? []) {
      out.push({ key: photo.id, photo, seed });
    }
  }
  out.sort((a, b) => new Date(b.photo.createdAt).getTime() - new Date(a.photo.createdAt).getTime());
  return out;
}

function formatPhotoDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function GalleryScreen() {
  const router = useRouter();
  const { seeds, loading, error } = useUserSeed();
  const [selected, setSelected] = useState<GalleryCell | null>(null);

  const cells = useMemo(() => flattenPhotos(seeds as UserSeed[]), [seeds]);

  const seedStillInCollection = useCallback((collectionId: string) => (seeds as UserSeed[]).some((s) => s.id === collectionId), [seeds]);

  const openSeed = (seed: UserSeed) => {
    const seedId = seed.customSeedId ? seed.customSeedId : seed.catalogSeedId;
    const source = seed.customSeedId ? 'custom' : 'catalog';
    router.push({
      pathname: `/home/${seedId}`,
      params: { source, tab: 'My Seeds' },
    });
    setSelected(null);
  };

  if (loading) return <Loading message="Loading photos…" />;
  if (error) return <ScreenMessage message={error} />;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Photo gallery</Text>
      <Text style={styles.subtitle}>Tap a photo for a larger view</Text>

      {cells.length === 0 ? (
        <ScreenMessage message="No photos yet. Add photos from a seed’s Photos tab." />
      ) : (
        <FlatList
          data={cells}
          keyExtractor={(item) => item.key}
          numColumns={COLS}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable style={styles.tile} onPress={() => setSelected(item)}>
              <Image source={{ uri: item.photo.imageUri }} style={styles.thumb} resizeMode="cover" />
            </Pressable>
          )}
        />
      )}

      <Modal visible={selected !== null} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setSelected(null)}>
          <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
            {selected && (
              <>
                <Image source={{ uri: selected.photo.imageUri }} style={styles.modalImage} resizeMode="contain" />
                <Text style={styles.modalSeedName}>{selected.seed.name}</Text>
                <Text style={styles.modalDate}>Added {formatPhotoDate(selected.photo.createdAt)}</Text>

                {seedStillInCollection(selected.seed.id) && (
                  <View style={styles.modalActions}>
                    <Button text="View seed" size="small" onPress={() => openSeed(selected.seed)} />
                  </View>
                )}

                <View style={styles.modalActions}>
                  <Button text="Close" size="small" onPress={() => setSelected(null)} color="secondary" />
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  title: { fontSize: 22, fontWeight: '700', paddingHorizontal: PAD, marginTop: 8 },
  subtitle: { fontSize: 14, color: colors.secondary, paddingHorizontal: PAD, marginBottom: 12 },
  list: { paddingHorizontal: PAD, paddingBottom: 24 },
  row: { gap: GAP, marginBottom: GAP },
  tile: { width: TILE },
  thumb: {
    width: TILE,
    height: TILE,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: PAD,
  },
  modalCard: {
    width: '100%',
    maxWidth: SCREEN_W - PAD * 2,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  modalImage: {
    width: '100%',
    height: MODAL_IMAGE_MAX_H,
    backgroundColor: colors.lightGray,
    borderRadius: 8,
  },
  modalSeedName: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalDate: {
    fontSize: 14,
    color: colors.secondary,
  },
  modalActions: {
    marginTop: 4,
  },
});
