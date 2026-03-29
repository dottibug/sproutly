import { useCustomSeed } from '../../state/customSeed/CustomSeedContext';
import { DIFFICULTY, Difficulty, EXPOSURE, Exposure } from '../../state/userSeeds/seeds/seedInfoTypes';
import { ListSelector } from '../uiComponentBarrel';
import { InfoModalType } from '../../state/customSeed/customSeedTypes';
import { appStyles, inputStyles } from '../../styles/theme';
import { View } from 'react-native';

type ListSelectorsProps = {
  readonly showInfoModal: (infoType: InfoModalType) => void;
};

// ListSelectors.tsx: List selectors for difficulty and exposure. Used in CustomSeedSheet.tsx when creating a custom seed.
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
