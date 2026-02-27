import { View, Text, StyleSheet } from 'react-native';
import type { SeedType } from '../../lib/seedCatalog';
import { colors } from '../../styles/theme';

type SeedTypeIconProps = {
  readonly type: SeedType;
  readonly size: 'small' | 'medium';
};

// Renders a seed type icon (colored badge with initials of the seed type). Must pass in the seed type as a prop. Default size is medium.
export default function SeedTypeIcon({ type, size = 'medium' }: SeedTypeIconProps) {
  const seedTypeColor = {
    Vegetable: colors.teal,
    Flower: colors.pink,
    Fruit: colors.red,
    Herb: colors.lavender,
  };

  const seedTypeInitials = {
    Vegetable: 'V',
    Flower: 'FL',
    Fruit: 'FR',
    Herb: 'H',
  };

  const backgroundColor = seedTypeColor[type];
  const iconSize = size === 'small' ? 24 : 32;
  const initials = seedTypeInitials[type];
  const initialsSize = size === 'small' ? 12 : 14;
  const initialsLineHeight = size === 'small' ? 24 : 32;
  const seedTypeTextSize = size === 'small' ? 14 : 16;

  const iconStyle = [styles.icon, { backgroundColor: backgroundColor, width: iconSize, height: iconSize }];

  const initialsStyle = [styles.abbreviation, { fontSize: initialsSize, lineHeight: initialsLineHeight }];

  const seedTypeTextStyle = [styles.seedTypeText, { fontSize: seedTypeTextSize }];

  return (
    <View style={styles.container}>
      <View style={iconStyle}>
        <Text style={initialsStyle}>{initials}</Text>
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
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  seedTypeText: {
    marginLeft: 8,
  },
});
