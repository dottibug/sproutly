import { View, Image, StyleSheet } from 'react-native';
import Logo from '../app/Logo';
import { colors } from '../../styles/theme';

// SeedImage.tsx: Displays the image of a seed on the 'Seed Details' screen, Gallery, and seed cards.

type SeedImageProps = {
  readonly imageUri: string;
  readonly size: 'small' | 'medium' | 'large';
  readonly resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
};

export default function SeedImage({ imageUri, size, resizeMode = 'cover' }: SeedImageProps) {
  const frame = StyleSheet.flatten([
    size === 'small' && styles.smallImage,
    size === 'medium' && styles.mediumImage,
    size === 'large' && styles.largeImage,
  ]);
  if (!imageUri?.trim()) {
    return (
      <View style={[frame, styles.photoFrame]}>
        <Logo size={size} showText={false} />
      </View>
    );
  }
  return <Image source={{ uri: imageUri }} resizeMode={resizeMode} style={frame} />;
}

// ---- STYLES ----
const styles = StyleSheet.create({
  smallImage: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    height: 120,
    width: 120,
  },
  mediumImage: {
    height: 300,
    width: '100%',
  },
  largeImage: {
    height: 400,
    width: '100%',
  },
  photoFrame: {
    alignItems: 'center',
    backgroundColor: colors.gray300,
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
