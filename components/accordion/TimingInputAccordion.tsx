import { Text, TextInput, View } from 'react-native';
import { useCustomSeed } from '../../lib/contexts/CustomSeedContext';
import { appStyles } from '../../styles/theme';

export default function TimingInputAccordion() {
  const { timing, setTiming } = useCustomSeed();

  return (
    <View>
      <Text>Timing</Text>
      <TextInput placeholder="Timing" value={timing || ''} onChangeText={setTiming} multiline style={appStyles.customSeedAccordionInput} />
    </View>
  );
}
