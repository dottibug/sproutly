import { View, Text, StyleSheet } from 'react-native';

// Main screen 'Home' tab
export default function Home() {
  return (
    <View style={styles.container}>
      <Text>Sproutly App</Text>
      <Text style={styles.title}>Home</Text>
      <Text>User seed collection goes here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 8 },
});
