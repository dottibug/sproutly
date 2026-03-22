import { View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useCustomSeed } from '../../state/customSeeds/CustomSeedContext';
import { appStyles } from '../../styles/theme';
import Heading from '../ui/Heading';

export default function SeedTypeSelector() {
  const { type, setType } = useCustomSeed();

  return (
    <View style={appStyles.customSeedInputSection}>
      <Heading size="xsmall">Seed Type</Heading>
      <SegmentedButtons
        value={type}
        onValueChange={(value) => setType(value)}
        buttons={[
          { value: 'Vegetable', label: 'Veggie' },
          { value: 'Flower', label: 'Flower' },
          { value: 'Fruit', label: 'Fruit' },
          { value: 'Herb', label: 'Herb' },
        ]}
      />
    </View>
  );
}
