import { View, StyleSheet } from 'react-native';
import { SeedType } from '../../../lib/seedCatalog';
import Heading from '../Heading';
import SeedTypeIcon from '../SeedTypeIcon';

type SeedCardInfoProps = {
  readonly name: string;
  readonly category: string;
  readonly beanType: string | null;
  readonly type: SeedType;
};

export default function SeedCardInfo({ name, category, beanType, type }: SeedCardInfoProps) {
  const heading = `${name} ${category} ${beanType || ''}`;

  return (
    <View style={styles.seedInfo}>
      <Heading size="small">{heading}</Heading>
      <View style={styles.seedType}>
        <SeedTypeIcon type={type} size="small" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  seedInfo: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
  },
  seedType: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 12,
    // marginTop: 'auto',
  },
});
