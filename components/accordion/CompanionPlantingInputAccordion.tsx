import { Text, TextInput, View } from 'react-native';
import { useCustomSeed } from '../../lib/contexts/CustomSeedContext';
import { appStyles } from '../../styles/theme';

export default function CompanionPlantingInputAccordion() {
  const { companionPlanting, setCompanionPlanting } = useCustomSeed();

  return (
    <View>
      <Text>Companion Planting</Text>
      <TextInput
        placeholder="Companion Planting"
        value={companionPlanting || ''}
        onChangeText={setCompanionPlanting}
        multiline
        style={appStyles.customSeedAccordionInput}
      />
    </View>
  );
}
