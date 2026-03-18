import { RadioButton } from 'react-native-paper';
import { View, Text } from 'react-native';
import { useCustomSeed } from '../../context/CustomSeedContext';
import { Difficulty, DIFFICULTY } from '../../utils/types';
import { appStyles, colors } from '../../styles/theme';
import Heading from '../ui/Heading';

export default function DifficultySelector() {
  const { difficulty, setDifficulty } = useCustomSeed();
  return (
    <View style={appStyles.customSeedInputSection}>
      <Heading size="xsmall">Difficulty</Heading>
      <RadioButton.Group value={difficulty || ''} onValueChange={(value) => setDifficulty(value as Difficulty)}>
        {DIFFICULTY.map((d) => (
          <RadioButton.Item
            key={d}
            label={d}
            value={d as Difficulty}
            style={{ backgroundColor: d === difficulty ? colors.lightGray : colors.white }}
          />
        ))}
      </RadioButton.Group>
    </View>
  );
}
