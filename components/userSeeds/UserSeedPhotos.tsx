import { View, Text, Alert, Pressable, StyleSheet, Image, ScrollView } from 'react-native';
import { UserSeedTab } from '../../state/app/appTypes';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import { useUserSeed } from '../../state/userSeeds/UserSeedsContext';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { FAB as PaperFAB } from 'react-native-paper';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../styles/theme';

function photosFabIcon({ size, color }: { size: number; color: string }) {
  return <FontAwesome5 name="camera" size={size} color={color} solid />;
}

// TODO: styling
// TODO: Error handling
// TODO: Show a brief placeholder image while photo is uploading so the user knows the photo is being added

type UserSeedPhotosProps = {
  readonly activeTab: UserSeedTab;
  readonly seed: UserSeed;
};

const NO_PHOTOS = 'No photos yet. Add one to track progress.';

const FAB_BOTTOM_GAP = 16;

// UserSeedPhotos component displays the photos of a single seed in the user's collection
export default function UserSeedPhotos({ seed, activeTab }: UserSeedPhotosProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { addPhoto, deletePhoto } = useUserSeed();

  const photos = seed.photos ?? [];
  const hasPhotos = photos.length > 0;

  const handleAddPhoto = () => {
    void addPhoto({ userSeedId: seed.id });
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
    <View style={[styles.screen, { display: activeTab === 'Photos' ? 'flex' : 'none' }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: FAB_BOTTOM_GAP + 56 + tabBarHeight + insets.bottom + 16 },
        ]}
      >
        {!hasPhotos && <Text style={styles.empty}>{NO_PHOTOS}</Text>}
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
      </ScrollView>

      <PaperFAB
        accessibilityLabel="Add photo"
        icon={photosFabIcon}
        style={[
          styles.fab,
          {
            backgroundColor: colors.hunterGreen,
            bottom: FAB_BOTTOM_GAP + tabBarHeight + insets.bottom,
            right: FAB_BOTTOM_GAP,
          },
        ]}
        color={colors.white}
        onPress={handleAddPhoto}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: 'relative',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  empty: {
    marginVertical: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
  },
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
