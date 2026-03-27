import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../../styles/theme';

// NoSeedsCollected.tsx: Displays a message when a user has no seeds collected. Used in the Profile screen.
export default function NoSeedsCollected() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grow Your Garden</Text>
      <Text style={styles.subtitle}>• no seeds collected •</Text>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.aladin.fontFamily,
    fontSize: 52,
    color: colors.greenMedium,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.secondary,
    textAlign: 'center',
  },
});
