import { TextInput, View } from 'react-native';
import { useCustomSeed } from '../../state/customSeeds/CustomSeedContext';
import { appStyles } from '../../styles/theme';
import Heading from '../ui/Heading';

export default function HarvestInput() {
  const { harvest, setHarvest } = useCustomSeed();

  return (
    <View style={appStyles.customSeedInputSection}>
      <Heading size="xsmall">Harvest</Heading>
      <TextInput
        placeholder="Harvest"
        value={harvest || ''}
        onChangeText={setHarvest}
        multiline
        style={appStyles.customSeedMultilineInput}
      />
    </View>
  );
}
