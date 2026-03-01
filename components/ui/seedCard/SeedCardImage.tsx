import { Image, StyleSheet } from 'react-native';

type SeedCardImageProps = {
  readonly imageUri: string;
};

export default function SeedCardImage({ imageUri }: SeedCardImageProps) {
  return <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />;
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 9,
    height: 96,
    width: 96,
  },
});
