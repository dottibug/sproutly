import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Settings tab screen
export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text>Settings will go here.</Text>
      <Text>Dark mode</Text>
      <Text>Quick filters</Text>
      <Text>Possibly basic vs detailed seed cards on the user collection screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 8 },
});
