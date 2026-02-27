import { View, Text, StyleSheet } from 'react-native';
import Heading from '../ui/Heading';
import { typography } from '../../styles/theme';

type SeedDetailSectionProps = {
  readonly children?: React.ReactNode;
  readonly title: string;
  readonly details: string | null;
};

export default function SeedDetailSection({ children, title, details = null }: SeedDetailSectionProps) {
  return (
    <View style={styles.section}>
      <Heading uppercase>{title}</Heading>
      {details && <Text style={typography.textSmall}>{details}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 18,
    paddingBottom: 18,
  },
});
