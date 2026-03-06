import { View, StyleSheet } from 'react-native';
import { SeedType } from '../../../lib/seedCatalog';
import Heading from '../Heading';
import Badge from '../Badge';
import { colors } from '../../../styles/theme';

const seedTypeColor = {
  Vegetable: colors.teal,
  Flower: colors.peach,
  Fruit: colors.pink,
  Herb: colors.lavender,
};

type SeedCardInfoProps = {
  readonly name: string;
  readonly category: string;
  readonly beanType: string | null;
  readonly seedType: SeedType;
  readonly cardType: 'user' | 'catalog';
  readonly inUserCollection?: boolean;
};

export default function SeedCardInfo({ name, category, beanType, seedType, cardType, inUserCollection = false }: SeedCardInfoProps) {
  const heading = `${name} ${category} ${beanType || ''}`;

  const backgroundColor = seedTypeColor[seedType];

  return (
    <View style={styles.seedInfo}>
      <Heading size="small">{heading}</Heading>
      <View style={styles.badges}>
        <Badge type="card" text={seedType} color={backgroundColor} width={100} />
        {cardType === 'catalog' && inUserCollection && <Badge type="card" text="Owned" color={colors.dusk} width={72} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  seedInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  seedType: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
  },
});
