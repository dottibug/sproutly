import { View, StyleSheet } from 'react-native';
import { Category } from '../../../state/userSeeds/seeds/seedInfoTypes';
import Heading from '../../ui/Heading';
import Badge from '../../ui/Badge';
import { colors } from '../../../styles/theme';

const categoryColor = {
  Vegetable: colors.teal,
  Flower: colors.peach,
  Fruit: colors.pink,
  Herb: colors.lavender,
};

const ownedAccent = colors.dusk;

type SeedCardInfoProps = {
  readonly variety: string;
  readonly plant: string;
  readonly beanType: string | null;
  readonly category: Category;
  readonly cardType: 'user' | 'browse';
  readonly inUserCollection?: boolean;
};

// SeedCardInfo component displays the information of a single seed in the user's collection or the browse list
export default function SeedCardInfo({
  variety,
  plant,
  beanType,
  category,
  cardType,
  inUserCollection = false,
}: SeedCardInfoProps) {
  const heading = `${variety} ${plant} ${beanType || ''}`;
  const backgroundColor = categoryColor[category];

  return (
    <View style={styles.seedInfo}>
      <Heading size="small">{heading}</Heading>
      <View style={styles.badges}>
        <Badge type="card" text={category} color={backgroundColor} width={100} />
        {cardType === 'browse' && inUserCollection && <Badge type="card" text="Owned" color={ownedAccent} width={72} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  seedInfo: {
    gap: 10,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
});
