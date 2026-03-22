import { View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { useCustomSeed } from '../../state/customSeeds/CustomSeedContext';
import { appStyles } from '../../styles/theme';
import Heading from '../ui/Heading';

export default function BeanTypeSelector() {
  const { type, category, beanType, setBeanType } = useCustomSeed();

  const showBeanTypeSelector = type === 'Vegetable' && category.toLowerCase() === 'bean';

  if (!showBeanTypeSelector) return null;

  return (
    <View style={appStyles.customSeedInputSection}>
      <Heading size="xsmall">Bean Type</Heading>
      <SegmentedButtons
        value={beanType || ''}
        onValueChange={(value) => setBeanType(value as 'Broad' | 'Bush' | 'Pole' | null)}
        buttons={[
          { value: 'Broad', label: 'Broad' },
          { value: 'Bush', label: 'Bush' },
          { value: 'Pole', label: 'Pole' },
        ]}
      />
    </View>
  );
}
