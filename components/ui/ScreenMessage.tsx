import { Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';

type EmptyListProps = {
  readonly message: string;
};

export default function ScreenMessage({ message }: EmptyListProps) {
  return <Text style={styles.screenMessageText}>{message}</Text>;
}

const styles = StyleSheet.create({
  screenMessageText: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.secondary,
  },
});
