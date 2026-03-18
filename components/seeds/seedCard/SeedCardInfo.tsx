import { View, StyleSheet } from 'react-native';
import { SeedType } from '../../../utils/types';
import { router } from 'expo-router';
import Heading from '../../ui/Heading';
import Badge from '../../ui/Badge';
import Button from '../../ui/buttons/Button';
import { colors } from '../../../styles/theme';

const seedTypeColor = {
  Vegetable: colors.teal,
  Flower: colors.peach,
  Fruit: colors.pink,
  Herb: colors.lavender,
};

type SeedCardInfoProps = {
  readonly seedId: string;
  readonly name: string;
  readonly category: string;
  readonly beanType: string | null;
  readonly seedType: SeedType;
  readonly cardType: 'user' | 'browse';
  readonly inUserCollection?: boolean;
};

// SeedCardInfo component displays the information of a single seed in the user's collection or the browse list
export default function SeedCardInfo({
  seedId,
  name,
  category,
  beanType,
  seedType,
  cardType,
  inUserCollection = false,
}: SeedCardInfoProps) {
  const heading = `${name} ${category} ${beanType || ''}`;
  const backgroundColor = seedTypeColor[seedType];

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
          <Badge type="card" text={seedType} color={backgroundColor} width={100} />
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
  seedType: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
  },
});
