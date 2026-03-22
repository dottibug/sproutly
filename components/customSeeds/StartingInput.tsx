import { TextInput, View } from 'react-native';
import { useCustomSeed } from '../../state/customSeeds/CustomSeedContext';
import { appStyles } from '../../styles/theme';
import Heading from '../ui/Heading';

export default function StartingInput() {
  const { starting, setStarting } = useCustomSeed();

  return (
    <View style={appStyles.customSeedInputSection}>
      <Heading size="xsmall">Starting</Heading>
      <TextInput
        placeholder="Starting"
        value={starting || ''}
        onChangeText={setStarting}
        multiline
        style={appStyles.customSeedMultilineInput}
      />
    </View>
  );
}
