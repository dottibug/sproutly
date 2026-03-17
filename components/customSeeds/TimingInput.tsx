import { TextInput, View } from 'react-native';
import { useCustomSeed } from '../../lib/contexts/CustomSeedContext';
import { appStyles } from '../../styles/theme';
import Heading from '../ui/Heading';

export default function TimingInput() {
  const { timing, setTiming } = useCustomSeed();

  return (
    <View style={appStyles.customSeedInputSection}>
      <Heading size="xsmall">Timing</Heading>
      <TextInput placeholder="Timing" value={timing || ''} onChangeText={setTiming} multiline style={appStyles.customSeedMultilineInput} />
    </View>
  );
}
