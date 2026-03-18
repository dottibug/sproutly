import { View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { appStyles, colors } from '../../styles/theme';
import Heading from '../ui/Heading';
import { useCustomSeed } from '../../context/CustomSeedContext';
import { Exposure, EXPOSURE } from '../../utils/types';

export default function ExposureSelector() {
  const { exposure, setExposure } = useCustomSeed();
  return (
    <View style={appStyles.customSeedInputSection}>
      <Heading size="xsmall">Exposure</Heading>
      <RadioButton.Group value={exposure || ''} onValueChange={(value) => setExposure(value as Exposure)}>
        {EXPOSURE.map((e) => (
          <RadioButton.Item
            key={e}
            label={e}
            value={e as Exposure}
            style={{ backgroundColor: e === exposure ? colors.lightGray : colors.white }}
          />
        ))}
      </RadioButton.Group>
    </View>
  );
}
