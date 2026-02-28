import { ActivityIndicator, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../styles/theme';

export default function AppLoadingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color={colors.hunterGreen} />
      <Text style={styles.message}>Loading...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  message: {
    color: colors.gray,
    fontSize: 12,
    marginTop: 16,
  },
});
