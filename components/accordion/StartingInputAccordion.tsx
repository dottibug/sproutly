import { Text, TextInput, View } from 'react-native';
import { useCustomSeed } from '../../lib/contexts/CustomSeedContext';
import { appStyles } from '../../styles/theme';

export default function StartingInputAccordion() {
  const { starting, setStarting } = useCustomSeed();

  return (
    <View>
      <Text>Starting</Text>
      <TextInput
        placeholder="Starting"
        value={starting || ''}
        onChangeText={setStarting}
        multiline
        style={appStyles.customSeedAccordionInput}
      />
    </View>
  );
}
