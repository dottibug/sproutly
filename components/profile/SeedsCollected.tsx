import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../../styles/theme';

// SeedsCollected.tsx: Displays the number of seeds a user has in their collection. Used in the Profile screen.
type SeedsCollectedProps = {
  readonly seedCount: number;
};

export default function SeedsCollected({ seedCount }: SeedsCollectedProps) {
  const seedWord = seedCount === 1 ? 'seed' : 'seeds';
  return (
    <View style={styles.container}>
      <Text style={styles.numSeeds}>{seedCount}</Text>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{seedWord}</Text>
        <Text style={[styles.text, styles.bottomTextLine]}>collected</Text>
      </View>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  numSeeds: {
    color: colors.greenMedium,
    fontFamily: fonts.aladin.fontFamily,
    fontSize: 96,
  },
  textContainer: {
    flexDirection: 'column',
    gap: 0,
    height: 'auto',
    justifyContent: 'center',
  },
  text: {
    color: colors.secondary,
    fontSize: 32,
    fontWeight: 'bold',
  },
  bottomTextLine: {
    paddingBottom: 13,
  },
});
