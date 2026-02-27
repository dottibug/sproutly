import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';

type ErrorSeedListProps = {
  readonly error: string;
};

export default function ErrorSeedList({ error }: ErrorSeedListProps) {
  return (
    <SafeAreaView>
      <Text style={styles.errorText}>Error: {error}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  errorText: {
    color: colors.primary,
    textAlign: 'center',
  },
});
