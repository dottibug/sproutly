import { View, StyleSheet } from 'react-native';
import { Input } from '../uiComponentBarrel';
import { appStyles, inputStyles } from '../../styles/theme';
import { useCustomSeed } from '../../state/customSeed/CustomSeedContext';
import { CustomSeedErrors } from '../../state/customSeed/customSeedTypes';

type PlantVarietyInputProps = {
  readonly errors: CustomSeedErrors;
};

// PlantVarietyInput.tsx: Inputs for variety name and plant type. Used in CustomSeedSheet.tsx when creating a custom seed.
export default function PlantVarietyInput({ errors }: PlantVarietyInputProps) {
  const customSeed = useCustomSeed();

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
          onChangeText={(text) => customSeed.setPlant(text)}
          hasError={Boolean(errors?.plant)}
          errorMessage={errors?.plant}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
