import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../styles/theme';

export type exposureType = 'Full sun' | 'Part sun' | 'Full sun to part shade' | 'Part shade' | 'Shade';

type ExposureProps = {
  readonly exposure: exposureType;
};

// Renders a badge with the required sun exposure. Must pass in the exposure as a prop.
export default function Exposure({ exposure }: ExposureProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { width: exposure === 'Full sun to part shade' ? 180 : 100 }]}>{exposure}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blue,
    borderRadius: 50,
    padding: 8,
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
