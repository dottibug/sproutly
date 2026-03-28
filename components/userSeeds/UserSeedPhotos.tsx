import { View, Text, Pressable, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo, useState } from 'react';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import { UserSeedTab } from '../../state/app/appTypes';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import { GalleryCell } from '../../state/userSeeds/photos/photoTypes';
import { flattenPhotos } from '../../state/userSeeds/photos/photoUtils';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Loading from '../ui/Loading';
import ScreenMessage from '../ui/ScreenMessage';
import GalleryModal from '../gallery/GalleryModal';
import { colors } from '../../styles/theme';
import FABButton from '../ui/buttons/FABButton';
import AlertDialog from '../ui/AlertDialog';

type UserSeedPhotosProps = {
  readonly activeTab: UserSeedTab;
  readonly seed: UserSeed;
};

// UserSeedPhotos.tsx: Displays the photos of a single seed in the user's collection. Includes a FAB to add a new photo, delete buttons for each photo, and a modal to view an enlarged photo.
export default function UserSeedPhotos({ seed, activeTab }: UserSeedPhotosProps) {
  const insets = useSafeAreaInsets();
  const { loading, error, addPhoto, deletePhoto } = useUserSeed();
  const [selected, setSelected] = useState<GalleryCell | null>(null);

  const cells = useMemo(() => flattenPhotos([seed] as UserSeed[]), [seed]);
  const hasPhotos = cells.length > 0;

  if (loading) return <Loading message="Loading photos…" />;
  if (error) return <ScreenMessage message={error} />;

  const handleAddPhoto = () => {
    void addPhoto({ userSeedId: seed.id });
  };

  const handleDeletePhoto = (photoId: string) => {
    AlertDialog({
      title: DELETE_PHOTO_TITLE,
      message: DELETE_PHOTO_MESSAGE,
      onPress: () => {
        deletePhoto(photoId).catch((error) => console.error('Error deleting photo:', error));
      },
    });
  };

  // Render item for the FlatList
  const photoCell = ({ item }: { item: GalleryCell }) => (
    <Pressable style={styles.tile} onPress={() => setSelected(item)}>
      <Image source={{ uri: item.photo.imageUri }} style={styles.thumb} resizeMode="cover" />
      <Pressable style={styles.deleteButton} onPress={() => handleDeletePhoto(item.photo.id)}>
        <FontAwesome5 name="trash-alt" size={20} color={colors.alabaster} />
      </Pressable>
    </Pressable>
  );

  return (
    <View style={[styles.container, { display: activeTab === 'Photos' ? 'flex' : 'none' }]}>
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

      <GalleryModal visible={selected !== null} onRequestClose={() => setSelected(null)} selected={selected} useViewButton={false} />

      <FABButton iconName="camera" iconSize={24} accessibilityLabel="Add photo" bottomInset={insets.bottom} onPress={handleAddPhoto} />
    </View>
  );
}

// ---- FAB ICON ----
function photosFabIcon({ size, color }: { size: number; color: string }) {
  return <FontAwesome5 name="camera" size={size} color={color} solid />;
}

// ---- CONSTANTS ----
const NO_PHOTOS_MESSAGE = 'No photos yet. Add photos to track the progress of your seeds.';
const DELETE_PHOTO_TITLE = 'Delete photo?';
const DELETE_PHOTO_MESSAGE = 'This cannot be undone.';
const GAP = 8;
const COLS = 2;
const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 16;
const CELL_SIZE = (SCREEN_WIDTH - PADDING * 2 - GAP) / COLS;

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.alabaster,
    flex: 1,
    paddingTop: PADDING,
    position: 'relative',
  },
  subtitle: {
    color: colors.secondary,
    fontSize: 16,
    marginBottom: 14,
    paddingHorizontal: PADDING,
  },
  thumb: {
    backgroundColor: colors.lightGray,
    borderRadius: 18,
    height: CELL_SIZE,
    width: CELL_SIZE,
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
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.opaqueBlack,
    borderRadius: 999,
    padding: 7,
    zIndex: 2,
  },
  fab: {
    position: 'absolute',
  },
});
