import { View, Image, StyleSheet, Pressable, Text } from 'react-native';
import { selectImage } from '../../state/userSeeds/photos/photoUtils';
import { appStyles, colors, inputStyles } from '../../styles/theme';
import Heading from '../ui/Heading';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ImagePreview } from '../../state/userSeeds/photos/photoTypes';

type ImagePickerProps = {
  readonly profileId: string | null;
  readonly preview: ImagePreview | null;
  readonly setPreview: (preview: ImagePreview | null) => void;
};

export default function ImagePicker({ profileId, preview, setPreview }: ImagePickerProps) {
  const handleAddPhoto = async () => {
    if (!profileId) return;
    const previewImage = await selectImage();
    if (!previewImage) return;
    setPreview(previewImage);
  };

  const handleEditPhoto = async () => {
    if (!profileId) return;
    const previewImage = await selectImage();
    if (!previewImage) return;
    setPreview(previewImage);
  };

  const handleRemovePhoto = async () => {
    if (!profileId) return;
    setPreview(null);
  };

  return (
    <View style={inputStyles.inputSection}>
      <Heading size="xsmall">Photo</Heading>

      {preview === null ? (
        <View style={styles.imagePlaceholder}>
          <FontAwesome6 name="mountain-sun" size={72} color="white" />
          <Pressable style={[styles.absolute, styles.photoButton]} onPress={handleAddPhoto}>
            <FontAwesome6 name="plus" size={24} color={colors.white} />
          </Pressable>
        </View>
      ) : (
        <View style={styles.imageContainer}>
          <Image source={{ uri: preview.uri }} style={styles.image} resizeMode="cover" />
          <View style={[styles.absolute, styles.photoButtons]}>
            <Pressable style={styles.photoButton} onPress={handleRemovePhoto}>
              <FontAwesome6 name="xmark" size={24} color={colors.white} />
            </Pressable>
            <Pressable style={styles.photoButton} onPress={handleEditPhoto}>
              <FontAwesome6 name="pencil" size={20} color={colors.white} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
  },
  absolute: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  photoButtons: {
    flexDirection: 'column',
    gap: 16,
  },
  photoButton: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 999,
    zIndex: 1,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoActionButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.gray300,
    padding: 2,
    width: 96,
  },
  imagePlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.gray300,
    borderRadius: 9,
    height: 300,
    justifyContent: 'center',
    width: 300,
  },
  image: {
    borderRadius: 9,
    height: 300,
    width: 300,
  },
});
