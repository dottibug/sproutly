import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';

// Loading.tsx: A loading component with a message

type LoadingProps = {
  readonly message?: string;
};

export default function Loading({ message = 'Seeds sprouting…' }: LoadingProps) {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color={colors.greenDark} />
      <Text style={styles.message}>{message}</Text>
    </SafeAreaView>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginTop: 96,
  },
  message: {
    color: colors.greenDark,
    fontSize: 20,
  },
});
