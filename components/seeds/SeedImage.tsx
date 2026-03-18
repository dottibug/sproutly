import { Image, StyleSheet } from 'react-native';

const DEFAULT_SEED_IMAGE = require('../../assets/icons/sprout.png');

type SeedImageProps = {
  readonly imageUri: string;
  readonly size: 'small' | 'large';
};

// SeedImage component displays the image of a seed
export default function SeedImage({ imageUri, size }: SeedImageProps) {
  return (
    <Image
      source={imageUri ? { uri: imageUri } : DEFAULT_SEED_IMAGE}
      resizeMode="cover"
      style={size === 'small' ? styles.smallImage : styles.largeImage}
    />
  );
}

const styles = StyleSheet.create({
  smallImage: {
    borderRadius: 9,
    height: 96,
    width: 96,
  },
  largeImage: {
    height: 400,
    width: '100%',
  },
});
