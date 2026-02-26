import { View, Text, StyleSheet } from 'react-native';
import type { SeedType } from '../lib/seedCatalog';

type SeedTypeIconProps = {
  readonly type: SeedType;
  readonly size: 'small' | 'medium';
};

export default function SeedTypeIcon({ type, size = 'medium' }: SeedTypeIconProps) {
  const seedTypeColor = {
    Vegetable: '#4B927A', // green: #4B927A
    Flower: '#DE86BF', // pink #DE86BF
    Fruit: '#D65564', // red #D65564
    Herb: '#6D5379', // lavender: #6D5379
  };

  const seedTypeAbbreviation = {
    Vegetable: 'V',
    Flower: 'FL',
    Fruit: 'FR',
    Herb: 'H',
  };

  const backgroundColor = seedTypeColor[type];
  const iconSize = size === 'small' ? 24 : 32;
  const abbreviation = seedTypeAbbreviation[type];
  const abbreviationSize = size === 'small' ? 12 : 14;
  const abbreviationLineHeight = size === 'small' ? 24 : 32;
  const seedTypeTextSize = size === 'small' ? 14 : 16;

  const iconStyle = [styles.icon, { backgroundColor: backgroundColor, width: iconSize, height: iconSize }];

  const abbreviationStyle = [styles.abbreviation, { fontSize: abbreviationSize, lineHeight: abbreviationLineHeight }];

  const seedTypeTextStyle = [styles.seedTypeText, { fontSize: seedTypeTextSize }];

  return (
    <View style={styles.container}>
      <View style={iconStyle}>
        <Text style={abbreviationStyle}>{abbreviation}</Text>
      </View>
      <Text style={seedTypeTextStyle}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    borderRadius: 50,
  },
  abbreviation: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  seedTypeText: {
    marginLeft: 8,
  },
});
