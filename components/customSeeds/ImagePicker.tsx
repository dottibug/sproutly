import { View, Image, StyleSheet, Pressable, Text } from 'react-native';
import { pickImage } from '../../lib/utils/userSeedImageUtils';
import { appStyles, colors } from '../../styles/theme';
import Heading from '../ui/Heading';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { PreviewImage } from '../../lib/types';

// TODO: if image picked, button should say "Edit photo" to either change the photo or remove it

type ImagePickerProps = {
  readonly profileId: string | null;
  readonly preview: PreviewImage | null;
  readonly setPreview: (preview: PreviewImage) => void;
};

export default function ImagePicker({ profileId, preview, setPreview }: ImagePickerProps) {
  const handleAddPhoto = async () => {
    if (!profileId) return;
    const previewImage = await pickImage();
    if (!previewImage) return;
    setPreview(previewImage);
  };

  return (
    <View style={appStyles.customSeedInputSection}>
      <Heading size="xsmall">Photo</Heading>

      {preview === null ? (
        <View style={styles.imagePlaceholder}>
          <FontAwesome6 name="mountain-sun" size={48} color="white" />
        </View>
      ) : (
        <Image source={{ uri: preview.uri }} style={styles.image} resizeMode="cover" />
      )}

      <Pressable style={styles.addPhotoButton} onPress={handleAddPhoto}>
        <Text>Add Photo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addPhotoButton: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.lightGray,
    padding: 2,
    width: 96,
  },
  imagePlaceholder: {
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 9,
    height: 96,
    justifyContent: 'center',
    width: 96,
  },
  image: {
    borderRadius: 9,
    height: 96,
    width: 96,
  },
});
