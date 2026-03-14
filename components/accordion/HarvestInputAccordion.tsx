import { Text, TextInput, View } from 'react-native';
import { useCustomSeed } from '../../lib/contexts/CustomSeedContext';
import { appStyles } from '../../styles/theme';

export default function HarvestInputAccordion() {
  const { harvest, setHarvest } = useCustomSeed();

  return (
    <View>
      <Text>Harvest</Text>
      <TextInput
        placeholder="Harvest"
        value={harvest || ''}
        onChangeText={setHarvest}
        multiline
        style={appStyles.customSeedAccordionInput}
      />
    </View>
  );
}
