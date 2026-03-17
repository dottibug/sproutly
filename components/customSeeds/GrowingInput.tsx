import { TextInput, View } from 'react-native';
import { useCustomSeed } from '../../lib/contexts/CustomSeedContext';
import { appStyles } from '../../styles/theme';
import Heading from '../ui/Heading';

export default function GrowingInput() {
  const { growing, setGrowing } = useCustomSeed();

  return (
    <View style={appStyles.customSeedInputSection}>
      <Heading size="xsmall">Growing</Heading>
      <TextInput
        placeholder="Growing"
        value={growing || ''}
        onChangeText={setGrowing}
        multiline
        style={appStyles.customSeedMultilineInput}
      />
    </View>
  );
}
