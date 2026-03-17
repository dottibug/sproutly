import { View, TextInput } from 'react-native';
import Heading from '../ui/Heading';
import { useCustomSeed } from '../../lib/contexts/CustomSeedContext';
import { appStyles } from '../../styles/theme';

export default function SeedNameInput() {
  const { name, setName } = useCustomSeed();

  return (
    <View style={appStyles.customSeedInputSection}>
      <Heading size="xsmall">Name</Heading>
      <TextInput placeholder="Enter seed name" value={name} onChangeText={setName} style={appStyles.customSeedInput} />
    </View>
  );
}
