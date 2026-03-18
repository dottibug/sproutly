import { View, StyleSheet } from 'react-native';

type SeedCardOverlayProps = {
  readonly children: React.ReactNode;
};

// SeedCardOverlay component displays the overlay for a single seed in the user's collection or the browse list. Used on long press of a seed in the user's collection.
export default function SeedCardOverlay({ children }: SeedCardOverlayProps) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    marginBottom: 12,
    padding: 8,
    paddingBottom: 16,
    width: '100%',
  },
  content: {
    height: 96,
    justifyContent: 'space-around',
  },
});
