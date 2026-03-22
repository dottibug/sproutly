import { TextInput, View } from 'react-native';
import { useCustomSeed } from '../../state/customSeeds/CustomSeedContext';
import { appStyles } from '../../styles/theme';
import Heading from '../ui/Heading';

export default function MaturesInDaysInput() {
  const { maturesInDays, setMaturesInDays } = useCustomSeed();
  return (
    <View style={appStyles.customSeedInputSection}>
      <Heading size="xsmall">Matures In Days</Heading>
      <TextInput
        placeholder="Matures In Days"
        value={maturesInDays?.toString() || ''}
        onChangeText={(text) => setMaturesInDays(text ? Number.parseInt(text) : null)}
        inputMode="numeric"
        style={appStyles.customSeedInput}
      />
    </View>
  );
}
