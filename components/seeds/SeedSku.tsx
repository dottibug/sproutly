import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';

// SeedSKU.tsx: Displays the SKU of a seed in the 'Seed Details' screen

type SeedSKUProps = {
  readonly seedSKU: string | null;
  readonly catalogId: string;
};

export default function SeedSKU({ seedSKU, catalogId }: SeedSKUProps) {
  return (
    <View style={styles.skuContainer}>
      <Text style={styles.sku}>SKU: {seedSKU ?? 'Custom seed'}</Text>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  skuContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    marginTop: 4,
  },
  sku: {
    fontSize: 16,
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
