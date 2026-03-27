import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../../styles/theme';

// NoTasksToday.tsx: Displays a message when a user has no tasks due today. Used in the Profile screen.
export default function NoTasksToday() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Huzzah!</Text>
      <View style={styles.subtitleContainer}>
        <Text style={styles.bracket}>{`(`}</Text>
        <View style={styles.bracketContent}>
          <Text style={styles.subtitle}>No tasks</Text>
          <Text style={styles.subtitle}>due today</Text>
        </View>
        <Text style={styles.bracket}>{`)`}</Text>
      </View>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    alignItems: 'center',
    color: colors.greenMedium,
    fontFamily: fonts.aladin.fontFamily,
    fontSize: 72,
  },
  subtitleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 12,
  },
  bracket: {
    color: colors.greenLight,
    fontSize: 68,
  },
  bracketContent: {
    alignItems: 'center',
    flexDirection: 'column',
    paddingTop: 8,
  },
  subtitle: {
    color: colors.greenLight,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
