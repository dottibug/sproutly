import { TextInput, View } from 'react-native';
import { useCustomSeed } from '../../context/CustomSeedContext';
import { appStyles } from '../../styles/theme';
import Heading from '../ui/Heading';

export default function DescriptionInput() {
  const { description, setDescription } = useCustomSeed();

  return (
    <View style={appStyles.customSeedInputSection}>
      <Heading size="xsmall">Description</Heading>
      <TextInput
        placeholder="Description"
        value={description || ''}
        onChangeText={setDescription}
        multiline
        style={appStyles.customSeedMultilineInput}
      />
    </View>
  );
}
