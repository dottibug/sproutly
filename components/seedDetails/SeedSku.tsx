import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '../../styles/theme';
import Badge from '../ui/Badge';

type SeedSKUProps = {
  readonly seedSKU: string | null;
  readonly catalogId: string;
  readonly inUserCollection: boolean;
};
export default function SeedSKU({ seedSKU, catalogId, inUserCollection }: SeedSKUProps) {
  return (
    <View style={styles.skuContainer}>
      <Text style={styles.sku}>SKU: {seedSKU ?? 'Custom seed'}</Text>

      {inUserCollection && <Badge type="mini" text="Owned" color={colors.grape} width={90} />}
    </View>
  );
}

const styles = StyleSheet.create({
  skuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
