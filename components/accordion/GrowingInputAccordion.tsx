import { TextInput, Text, View } from 'react-native';
import { useCustomSeed } from '../../lib/contexts/CustomSeedContext';
import { appStyles } from '../../styles/theme';

export default function GrowingInputAccordion() {
  const { growing, setGrowing } = useCustomSeed();

  return (
    <View>
      <Text>Growing</Text>
      <TextInput
        placeholder="Growing"
        value={growing || ''}
        onChangeText={setGrowing}
        multiline
        style={appStyles.customSeedAccordionInput}
      />
    </View>
  );
}
