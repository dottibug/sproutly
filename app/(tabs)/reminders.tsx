import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Reminders tab screen
export default function RemindersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reminders</Text>
      <Text>Reminders will go here.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 8 },
});
