import { Menu } from 'react-native-paper';
import { View, Text, TextInput } from 'react-native';
import { useState } from 'react';
import { useCustomSeed } from '../../context/CustomSeedContext';
import { VEGETABLES, FLOWERS, FRUITS, HERBS } from '../../utils/types';
import { appStyles } from '../../styles/theme';
import Heading from '../ui/Heading';

export default function PlantCategoryInput() {
  const [plantMenuVisible, setPlantMenuVisible] = useState(false);
  const { type, category, setCategory } = useCustomSeed();

  const openMenu = () => setPlantMenuVisible(true);
  const closeMenu = () => setPlantMenuVisible(false);

  // TODO: if text string matches an entry in the applicable seed type array, scroll to/highlight that entry in the menu
  const handleSetPlant = (text: string) => {
    openMenu();
    setCategory(text);
  };

  const PlantMenu: React.ReactNode = (
    <TextInput placeholder="Bean, Tomato,etc." value={category} onChangeText={handleSetPlant} style={appStyles.customSeedInput} />
  );

  return (
    <View style={appStyles.customSeedInputSection}>
      <Heading size="xsmall">Plant Category</Heading>
      <Menu visible={plantMenuVisible} onDismiss={closeMenu} anchor={PlantMenu} anchorPosition="bottom">
        {type === 'Vegetable' && VEGETABLES.map((p) => <Menu.Item key={p} title={p} onPress={() => setCategory(p)} />)}
        {type === 'Flower' && FLOWERS.map((p) => <Menu.Item key={p} title={p} onPress={() => setCategory(p)} />)}
        {type === 'Fruit' && FRUITS.map((p) => <Menu.Item key={p} title={p} onPress={() => setCategory(p)} />)}
        {type === 'Herb' && HERBS.map((p) => <Menu.Item key={p} title={p} onPress={() => setCategory(p)} />)}
      </Menu>
    </View>
  );
}
