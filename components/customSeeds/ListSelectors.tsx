import { View } from 'react-native';
import { useCustomSeed } from '../../state/customSeed/CustomSeedContext';
import { DIFFICULTY, Difficulty, EXPOSURE, Exposure, InfoModalType } from '../../state/barrels/typesBarrel';
import { ListSelector } from '../uiComponentBarrel';
import { appStyles, inputStyles } from '../../styles/theme';

// ListSelectors.tsx: List selectors for difficulty and exposure. Used in CustomSeedSheet.tsx when creating a custom seed.

type ListSelectorsProps = {
  readonly showInfoModal: (infoType: InfoModalType) => void;
};

export default function ListSelectors({ showInfoModal }: ListSelectorsProps) {
  const customSeed = useCustomSeed();
  const difficultyOptions = DIFFICULTY.map((difficulty) => ({ value: difficulty, label: difficulty }));
  const exposureOptions = EXPOSURE.map((exposure) => ({ value: exposure, label: exposure }));

  return (
    <View style={[inputStyles.inputsWrapper, appStyles.screenPadding]}>
      <ListSelector
        title="Difficulty"
        value={customSeed.seed.difficulty}
        onValueChange={(value) => customSeed.setDifficulty(value as Difficulty)}
        options={difficultyOptions}
        showInfoIcon={true}
        onIconPress={() => showInfoModal('difficulty')}
      />
      <ListSelector
        title="Exposure"
        value={customSeed.seed.exposure}
        onValueChange={(value) => customSeed.setExposure(value as Exposure)}
        options={exposureOptions}
        showInfoIcon={true}
        onIconPress={() => showInfoModal('exposure')}
      />
    </View>
  );
}
