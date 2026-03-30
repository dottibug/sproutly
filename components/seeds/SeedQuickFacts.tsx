import Heading from '../ui/Heading';
import { View, StyleSheet } from 'react-native';

// SeedQuickFacts.tsx: Component that displays the quick facts of a single seed in the user's collection or the browse list

type SeedQuickFactsProps = {
  readonly maturesInDays: number | null;
  readonly difficulty: string | null;
};

export default function SeedQuickFacts({ maturesInDays, difficulty }: SeedQuickFactsProps) {
  return (
    <View style={styles.quickFacts}>
      {maturesInDays && (
        <Heading size="small" color="primary">
          Matures in {maturesInDays} days
        </Heading>
      )}
      {difficulty && (
        <Heading size="small" color="primary">
          Difficulty: {difficulty}
        </Heading>
      )}
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  quickFacts: {
    flexDirection: 'column',
    gap: 12,
  },
});
