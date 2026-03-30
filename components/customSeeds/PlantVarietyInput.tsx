import { View } from 'react-native';
import { Input } from '../uiComponentBarrel';
import { appStyles, inputStyles } from '../../styles/theme';
import { useCustomSeed } from '../../state/customSeed/CustomSeedContext';
import { CustomSeedErrors } from '../../state/customSeed/customSeedTypes';
import { isBeanCategoryAndPlant } from './validateCustomSeed';

// PlantVarietyInput.tsx: Inputs for variety name and plant type. Used in CustomSeedSheet.tsx when creating a custom seed.

type PlantVarietyInputProps = {
  readonly errors: CustomSeedErrors;
  readonly onDismissPlantError?: () => void;
};

export default function PlantVarietyInput({ errors, onDismissPlantError }: PlantVarietyInputProps) {
  const customSeed = useCustomSeed();

  const onPlantChange = (text: string) => {
    onDismissPlantError?.();
    customSeed.setPlant(text);
    // Clear bean type field if the plant is not "bean"
    if (!isBeanCategoryAndPlant(customSeed.seed.category, text)) {
      customSeed.setBeanType(null);
    }
  };

  return (
    <View style={[inputStyles.inputsWrapper, appStyles.screenPadding]}>
      <View style={inputStyles.inputSection}>
        <Input
          required
          label="Variety Name"
          placeholder="e.g. Sunrise Bumblebee"
          value={customSeed.seed.variety}
          onChangeText={(text) => customSeed.setVariety(text)}
          hasError={Boolean(errors?.variety)}
          errorMessage={errors?.variety}
        />
      </View>
      <View style={inputStyles.inputSection}>
        <Input
          required
          label="Plant Type"
          placeholder="e.g. Tomato"
          value={customSeed.seed.plant}
          onChangeText={onPlantChange}
          hasError={Boolean(errors?.plant)}
          errorMessage={errors?.plant}
        />
      </View>
    </View>
  );
}
