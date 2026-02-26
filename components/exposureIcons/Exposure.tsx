import { View, Text, StyleSheet } from 'react-native';

export type exposureType = 'Full sun' | 'Part sun' | 'Full sun to part shade' | 'Part shade' | 'Shade';

type ExposureProps = {
  readonly exposure: exposureType;
};

export default function Exposure({ exposure }: ExposureProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { width: exposure === 'Full sun to part shade' ? 180 : 100 }]}>{exposure}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#669BBC', // blue #669BBC
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
