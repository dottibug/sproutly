import { View, StyleSheet, Pressable } from 'react-native';
import { ImagePreview } from '../../state/userSeeds/photos/photoTypes';
import { selectImage } from '../../state/userSeeds/photos/photoUtils';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import SeedImage from '../seeds/SeedImage';
import { colors, inputStyles } from '../../styles/theme';

// ImagePicker.tsx: Component for selecting an image from the device and displaying it in a preview.
// Reference: https://docs.expo.dev/versions/latest/sdk/imagepicker/

type ImagePickerProps = {
  readonly profileId: string | null;
  readonly preview: ImagePreview | null;
  readonly setPreview: (preview: ImagePreview | null) => void;
};

export default function ImagePicker({ profileId, preview, setPreview }: ImagePickerProps) {
  // Triggers photo selection on the device
  const onPhotoSelect = async () => {
    if (!profileId) return;
    const previewImage = await selectImage();
    if (!previewImage) return;
    setPreview(previewImage);
  };

  // Removes the photo from the preview
  const onPhotoRemove = async () => {
    if (!profileId) return;
    setPreview(null);
  };

  return (
    <View style={inputStyles.inputSection}>
      {preview === null ? (
        <View style={styles.imagePlaceholder}>
          <FontAwesome6 name="image" size={130} color={colors.blackSheer15} />
          <Pressable style={[styles.absolute, styles.photoButton]} onPress={onPhotoSelect}>
            <FontAwesome6 name="plus" size={20} color={colors.gray100} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.imageContainer}>
          <SeedImage imageUri={preview.uri} size="medium" resizeMode="cover" />
          <View style={[styles.absolute, styles.photoButtons]}>
            <Pressable style={styles.photoButton} onPress={onPhotoRemove}>
              <FontAwesome6 name="xmark" size={24} color={colors.gray100} />
            </Pressable>
            <Pressable style={styles.photoButton} onPress={onPhotoSelect}>
              <FontAwesome6 name="pencil" size={22} color={colors.gray100} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  absolute: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  photoButtons: {
    flexDirection: 'column',
    gap: 16,
  },
  photoButton: {
    backgroundColor: colors.blackSheer65,
    borderRadius: 100,
    color: colors.gray200,
    zIndex: 1,
    width: 39,
    height: 39,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.gray300,
    borderRadius: 0,
    height: 300,
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    height: 300,
    width: '100%',
  },
});
