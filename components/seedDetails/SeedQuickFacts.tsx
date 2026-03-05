import Heading from '../ui/Heading';
import { View, StyleSheet } from 'react-native';

type SeedQuickFactsProps = {
  readonly maturesInDays: number | null;
  readonly difficulty: string | null;
};

export default function SeedQuickFacts({ maturesInDays, difficulty }: SeedQuickFactsProps) {
  return (
    <View style={styles.quickFacts}>
      {/* Matures in days */}
      {maturesInDays && (
        <Heading size="small" color="secondary">
          Matures in {maturesInDays} days
        </Heading>
      )}

      {/* Difficulty */}
      {difficulty && (
        <Heading size="small" color="secondary">
          Difficulty: {difficulty}
        </Heading>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  quickFacts: {
    flexDirection: 'column',
    gap: 12,
  },
});
