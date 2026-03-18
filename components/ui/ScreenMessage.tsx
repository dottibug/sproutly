import { Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';

type ScreenMessageProps = {
  readonly message: string;
};

// Message displayed when a list is empty or an error occurs
export default function ScreenMessage({ message }: ScreenMessageProps) {
  return <Text style={styles.screenMessageText}>{message}</Text>;
}

const styles = StyleSheet.create({
  screenMessageText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.secondary,
  },
});
