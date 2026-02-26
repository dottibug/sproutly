import { View, Text, StyleSheet } from 'react-native';

// Main screen 'My Seeds' tab
export default function MySeedsScreen() {
  return (
    <View style={styles.container}>
      <Text>Sproutly App</Text>
      <Text style={styles.title}>My Seeds</Text>
      <Text>User seed collection goes here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 8 },
});
