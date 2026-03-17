import { Image, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { getSignedSeedImageUrl } from '../../../lib/utils/userSeedImageUtils';

const DEFAULT_SEED_IMAGE = require('../../../assets/icons/sprout.png');

type SeedCardImageProps = {
  readonly imageUri: string | null | undefined;
};

const isPath = (uri: string) => uri.length > 0 && !uri.startsWith('http');

export default function SeedCardImage({ imageUri }: SeedCardImageProps) {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageUri || !isPath(imageUri)) {
      setSignedUrl(null);
      return;
    }
    const fetchSignedUrl = async () => {
      const url = await getSignedSeedImageUrl(imageUri);
      if (url) setSignedUrl(url);
    };
    fetchSignedUrl();
  }, [imageUri]);

  const uri = imageUri && !isPath(imageUri) ? imageUri : signedUrl;
  const source = uri ? { uri } : DEFAULT_SEED_IMAGE;

  return <Image source={source} style={styles.image} resizeMode="cover" />;
}

const styles = StyleSheet.create({
  image: {
    borderRadius: 9,
    height: 96,
    width: 96,
  },
});
