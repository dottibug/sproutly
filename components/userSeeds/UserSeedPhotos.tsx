import { View, Text, Alert, Pressable, StyleSheet, Image } from 'react-native';
import { UserSeedTab } from '../../state/app/appTypes';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
import { colors } from '../../styles/theme';

// TODO: styling
// TODO: Error handling
// TODO: Show a brief placeholder image while photo is uploading so the user knows the photo is being added

type UserSeedPhotosProps = {
  readonly activeTab: UserSeedTab;
  readonly seed: UserSeed;
};

const NO_PHOTOS = 'No photos yet. Add one to track progress.';

// UserSeedPhotos component displays the photos of a single seed in the user's collection
export default function UserSeedPhotos({ seed, activeTab }: UserSeedPhotosProps) {
  const { addPhoto, deletePhoto } = useUserSeed();

  const photos = seed.photos ?? [];
  const hasPhotos = photos.length > 0;

  const handleAddPhoto = async () => {
    await addPhoto({ userSeedId: seed.id });
  };

  const handleDeletePhoto = (photoId: string) => {
    Alert.alert('Delete photo?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deletePhoto(photoId).catch((error) => console.error('Error deleting photo:', error));
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, padding: 16, display: activeTab === 'Photos' ? 'flex' : 'none' }}>
      {!hasPhotos && <Text style={{ marginVertical: 16, textAlign: 'center' }}>{NO_PHOTOS}</Text>}
      {hasPhotos && (
        <View style={styles.grid}>
          {photos.map((photo) => (
            <View key={photo.createdAt} style={styles.tile}>
              <Image source={{ uri: photo.imageUri }} style={styles.image} resizeMode="cover" />
              <Pressable style={styles.deleteButton} onPress={() => handleDeletePhoto(photo.id)}>
                <MaterialCommunityIcons name="trash-can" size={20} color={colors.white} />
              </Pressable>
            </View>
          ))}
        </View>
      )}
      <Pressable style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 16 }} onPress={handleAddPhoto}>
        <Ionicons name="add-circle-outline" size={48} color="black" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.lightGray,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 999,
    padding: 6,
  },
});
