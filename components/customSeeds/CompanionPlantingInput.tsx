import { TextInput, View } from 'react-native';
import { useCustomSeed } from '../../lib/contexts/CustomSeedContext';
import { appStyles } from '../../styles/theme';
import Heading from '../ui/Heading';

export default function CompanionPlantingInput() {
  const { companionPlanting, setCompanionPlanting } = useCustomSeed();

  return (
    <View style={appStyles.customSeedInputSection}>
      <Heading size="xsmall">Companion Planting</Heading>
      <TextInput
        placeholder="Companion Planting"
        value={companionPlanting || ''}
        onChangeText={setCompanionPlanting}
        multiline
        style={appStyles.customSeedMultilineInput}
      />
    </View>
  );
}
