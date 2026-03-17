import { useState, useEffect } from 'react';
import { Image, StyleSheet } from 'react-native';
import { getSignedSeedImageUrl } from '../../lib/utils/userSeedImageUtils';

const DEFAULT_SEED_IMAGE = require('../../assets/icons/sprout.png');

type SeedImagePreviewProps = {
  readonly path: string | null | undefined;
};

export default function SeedImagePreview({ path }: SeedImagePreviewProps) {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    if (!path) {
      setUri(null);
      return;
    }

    const fetchImage = async () => {
      const url = await getSignedSeedImageUrl(path);
      if (url) setUri(url);
    };
    fetchImage();
  }, [path]);

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
