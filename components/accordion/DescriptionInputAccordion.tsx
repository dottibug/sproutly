import { Text, TextInput, View } from 'react-native';
import { useCustomSeed } from '../../lib/contexts/CustomSeedContext';
import { appStyles } from '../../styles/theme';

export default function DescriptionInputAccordion() {
  const { description, setDescription } = useCustomSeed();

  return (
    <View>
      <Text>Description</Text>
      <TextInput
        placeholder="Description"
        value={description || ''}
        onChangeText={setDescription}
        multiline
        style={appStyles.customSeedAccordionInput}
      />
    </View>
  );
}
