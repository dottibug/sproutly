import { Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';

// ScreenMessage.tsx: A message displayed when a list is empty or other errors occur

type ScreenMessageProps = {
  readonly message: string;
};

export default function ScreenMessage({ message }: ScreenMessageProps) {
  return <Text style={styles.screenMessageText}>{message}</Text>;
}

// ---- STYLES ----
const styles = StyleSheet.create({
  screenMessageText: {
    fontSize: 16,
    textAlign: 'center',
    alignSelf: 'center',
    color: colors.greenMedium,
    paddingVertical: 20,
    marginVertical: 14,
    marginHorizontal: 24,
    fontStyle: 'italic',
    fontWeight: '600',
  },
});
