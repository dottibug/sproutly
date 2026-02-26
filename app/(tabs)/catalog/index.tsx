import { Text, StyleSheet, ScrollView, ActivityIndicator, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSeedCatalog } from '../../../lib/contexts/SeedCatalogContext';
import type { SeedCatalogItem } from '../../../lib/seedCatalog';
import CatalogSeedCard from '../../../components/CatalogSeedCard';

import { clearSeedCatalogCache } from '../../../lib/seedCatalog';

// Seed Catalog screen
// TODO: Add a filter by type (vegetable, flower, fruit, herb) and search bar
export default function SeedCatalogScreen() {
  // TEMPORARY: Refresh button to clear cache when needed during testing
  const { refresh } = useSeedCatalog();
  const handleRefresh = async () => {
    await clearSeedCatalogCache();
    await refresh();
  };

  const { seeds, loading, error } = useSeedCatalog();

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="purple" />
        <Text style={styles.loadingText}>Loading catalog…</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {seeds.map((seed: SeedCatalogItem, index: number) => (
          <CatalogSeedCard key={seed.id} seed={seed} />
        ))}
      </ScrollView>

      {/* TEMPORARY: Refresh button to clear cache when needed during testing */}
      <Button title="Refresh" onPress={handleRefresh} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 12 },
  loadingText: { marginTop: 8, color: '#666' },
  errorText: { color: '#c62828', textAlign: 'center' },
  list: { flex: 1, gap: 16 },
  listContent: { paddingBottom: 24 },
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  cardName: { fontSize: 16 },
});
