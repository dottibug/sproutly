import { View, StyleSheet, Platform, Text, ActivityIndicator } from 'react-native';
import { colors } from '../../../styles/theme';

// SeedCardOverlay.tsx: Displays an overlay on a seed card when it is being saved to the database.

export default function SeedCardOverlay() {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.indicatorContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
        <Text style={styles.savingText}>Saving to your collection...</Text>
      </View>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.blackSheer15,
    borderRadius: 22,
    alignItems: 'center',

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.13,
        shadowRadius: 14,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    height: 120, // must match SeedImage height
    alignItems: 'center',
    gap: 18,
  },
  indicatorContainer: {},
  savingText: {
    fontSize: 16,
    fontWeight: 500,
    color: colors.gray600,
  },
});
