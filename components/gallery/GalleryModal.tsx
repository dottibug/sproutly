import { Modal, StyleSheet, Text, Image, View, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { GalleryCell } from '../../state/userSeeds/photos/photoTypes';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import { calculatePhotoAspectRatio, formatPhotoDate, getPhotoCaption } from '../../state/userSeeds/photos/photoUtils';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { colors } from '../../styles/theme';

type GalleryModalProps = {
  readonly visible: boolean;
  readonly onRequestClose: () => void;
  readonly selected: GalleryCell | null;
  readonly isSeedInCollection?: boolean;
  readonly useViewButton?: boolean;
};

// GalleryModal.tsx: Displays an enlarged view of a photo from the photo gallery. Includes the photo, a caption, photo date, and a link to the associated seed.
export default function GalleryModal({ visible, onRequestClose, selected, isSeedInCollection, useViewButton = true }: GalleryModalProps) {
  const router = useRouter();

  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();

  const uri = selected?.photo?.imageUri;
  const seed = selected?.seed;
  const variety = seed?.variety ?? '';
  const plant = seed?.plant ?? '';
  const caption = getPhotoCaption(variety, plant);
  const photoDate = formatPhotoDate(selected?.photo?.createdAt ?? '');
  const showViewSeedButton = isSeedInCollection && seed;

  // Aspect ratio to use for the photo (width / height)
  const [aspect, setAspect] = useState<number | null>(null);
  const aspectRatioReady = uri && aspect !== null;

  // Get the aspect ratio (width / height) of photo before displaying it (so the photo can be displayed correctly)
  useEffect(() => {
    setAspect(null);
    if (!uri) return; // No photo to display

    Image.getSize(
      uri,
      (width, height) => setAspect(calculatePhotoAspectRatio(width, height)),
      () => setAspect(1),
    );
  }, [uri]);

  // Navigate to this seed in the user's collection
  const viewSeedDetails = (seed: UserSeed | null) => {
    if (!seed) return;
    const seedId = seed.customSeedId ? seed.customSeedId : seed.catalogSeedId;
    const source = seed.customSeedId ? 'custom' : 'catalog';
    onRequestClose();
    router.replace({
      pathname: `/(tabs)/home/${seedId}`,
      params: { source, tab: 'My Seeds' },
    });
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
          <Pressable
            style={[styles.closeButton, { top: insets.top + 4 }]}
            onPress={onRequestClose}
            accessibilityRole="button"
            accessibilityLabel="Close">
            <FontAwesome6 name="xmark" size={26} color={colors.alabaster} />
          </Pressable>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={{ width: windowWidth }}>
              {aspectRatioReady && (
                <Image source={{ uri }} style={[styles.photo, { width: windowWidth, aspectRatio: aspect }]} resizeMode="contain" />
              )}

              {/* Avoid layout shift before the photo is loaded by displaying a placeholder */}
              {!aspectRatioReady && <View style={[styles.photo, { width: windowWidth, aspectRatio: 1 }]} />}

              <View style={styles.caption}>
                <Text style={styles.captionTitle}>{caption}</Text>
                <Text style={styles.captionDate}>Added {photoDate}</Text>

                {useViewButton && showViewSeedButton && (
                  <Pressable
                    onPress={() => viewSeedDetails(seed)}
                    style={styles.viewSeedButton}
                    accessibilityRole="button"
                    accessibilityLabel="View seed">
                    <Text style={styles.viewSeedText}>View seed</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

// ---- REFERENCES ----
// https://reactnative.dev/docs/image#getsize
// https://reactnative.dev/docs/usewindowdimensions
// https://docs.expo.dev/versions/latest/sdk/safe-area-context/#after

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    right: 8,
    zIndex: 2,
    padding: 12,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  photo: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
  },
  caption: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 4,
  },
  captionTitle: {
    color: colors.alabaster,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  captionDate: {
    color: colors.alabaster,
    fontSize: 14,
    marginTop: 4,
  },
  viewSeedButton: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingVertical: 6,
  },
  viewSeedText: {
    borderBottomColor: colors.alabaster,
    borderBottomWidth: StyleSheet.hairlineWidth,
    color: colors.alabaster,
    fontSize: 15,
    fontWeight: '600',
    paddingBottom: 2,
  },
});
