import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';

type SeedSKUProps = {
  readonly seedSKU: string | null;
  readonly catalogId: string;
};

// SeedSKU component displays the SKU of a single seed in the user's collection or the browse list
export default function SeedSKU({ seedSKU, catalogId }: SeedSKUProps) {
  return (
    <View style={styles.skuContainer}>
      <Text style={styles.sku}>SKU: {seedSKU ?? 'Custom seed'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  skuContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    marginTop: 4,
  },
  sku: {
    fontSize: 14,
    color: '#666',
  },
  inUserCollection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  inUserCollectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.dusk,
    textTransform: 'uppercase',
  },
});
