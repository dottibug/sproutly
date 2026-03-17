import { View, TextInput } from 'react-native';
import { useCustomSeed } from '../../lib/contexts/CustomSeedContext';
import { appStyles } from '../../styles/theme';
import Heading from '../ui/Heading';

export default function LatinInput() {
  const { latin, setLatin } = useCustomSeed();
  return (
    <View style={appStyles.customSeedInputSection}>
      <Heading size="xsmall">Latin</Heading>
      <TextInput
        placeholder="Latin"
        value={latin || ''}
        onChangeText={(text) => setLatin(text || null)}
        style={appStyles.customSeedInput}
      />
    </View>
  );
}
