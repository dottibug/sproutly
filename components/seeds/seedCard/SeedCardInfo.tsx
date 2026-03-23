import { View, StyleSheet } from 'react-native';
import { Category } from '../../../state/userSeeds/seeds/seedInfoTypes';
import { router } from 'expo-router';
import Heading from '../../ui/Heading';
import Badge from '../../ui/Badge';
import Button from '../../ui/buttons/AppButton';
import { colors } from '../../../styles/theme';

const categoryColor = {
  Vegetable: colors.teal,
  Flower: colors.peach,
  Fruit: colors.pink,
  Herb: colors.lavender,
};

type SeedCardInfoProps = {
  readonly seedId: string;
  readonly variety: string;
  readonly plant: string;
  readonly beanType: string | null;
  readonly category: Category;
  readonly cardType: 'user' | 'browse';
  readonly inUserCollection?: boolean;
};

// SeedCardInfo component displays the information of a single seed in the user's collection or the browse list
export default function SeedCardInfo({
  seedId,
  variety,
  plant,
  beanType,
  category,
  cardType,
  inUserCollection = false,
}: SeedCardInfoProps) {
  const heading = `${variety} ${plant} ${beanType || ''}`;
  const backgroundColor = categoryColor[category];

  // Redirects user to this seed in their collection (my seeds tab)
  const handleViewSeed = () =>
    router.push({
      pathname: `/home/${seedId}`,
      params: {
        source: 'catalog',
        tab: 'mySeeds',
      },
    });

  const handleAddSeed = () => router.push('/home/addCustomSeed');

  return (
    <View style={styles.seedInfo}>
      <View>
        <Heading size="small">{heading}</Heading>
        <View style={styles.badges}>
          <Badge type="card" text={category} color={backgroundColor} width={100} />
          {cardType === 'browse' && inUserCollection && <Badge type="card" text="Owned" color={colors.dusk} width={72} />}
        </View>
      </View>
      {cardType === 'browse' && (
        <View>
          {inUserCollection && <Button text="View My Seed" onPress={handleViewSeed} size="xsmall" width={112} />}
          {!inUserCollection && <Button text="Add Seed" onPress={handleAddSeed} size="xsmall" width={92} />}
        </View>
      )}
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
  category: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
  },
});
