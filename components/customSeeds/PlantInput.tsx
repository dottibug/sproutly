import { Menu } from 'react-native-paper';
import { View, Text, TextInput } from 'react-native';
import { useState } from 'react';
import { useCustomSeedForm } from '../../state/customSeedForm/CustomSeedFormContext';
import { VEGETABLES, FLOWERS, FRUITS, HERBS } from '../../state/userSeeds/seeds/seedInfoTypes';
import { appStyles } from '../../styles/theme';
import Heading from '../ui/Heading';
// import Required from './Required';

export default function PlantInput() {
  const [plantMenuVisible, setPlantMenuVisible] = useState(false);
  // const { category, plant, setPlant } = useCustomSeedForm();

  const openMenu = () => setPlantMenuVisible(true);
  const closeMenu = () => setPlantMenuVisible(false);

  // TODO: if text string matches an entry in the applicable seed type array, scroll to/highlight that entry in the menu
  const handleSetPlant = (text: string) => {
    openMenu();
    // setPlant(text);
  };

  // const PlantMenu: React.ReactNode = (
  //   // <TextInput placeholder="Bean, Tomato,etc." value={plant} onChangeText={handleSetPlant} style={appStyles.customSeedInput} />
  // );

  return (
    <View style={appStyles.customSeedInputSection}>
      {/* <Required> */}
      <Heading size="xsmall">Plant Type</Heading>
      {/* </Required> */}
      {/* <Menu visible={plantMenuVisible} onDismiss={closeMenu} anchor={PlantMenu} anchorPosition="bottom"> */}
      {/* {category === 'Vegetable' && VEGETABLES.map((p) => <Menu.Item key={p} title={p} onPress={() => setPlant(p)} />)}
        {category === 'Flower' && FLOWERS.map((p) => <Menu.Item key={p} title={p} onPress={() => setPlant(p)} />)}
        {category === 'Fruit' && FRUITS.map((p) => <Menu.Item key={p} title={p} onPress={() => setPlant(p)} />)}
        {category === 'Herb' && HERBS.map((p) => <Menu.Item key={p} title={p} onPress={() => setPlant(p)} />)} */}
      {/* </Menu> */}
    </View>
  );
}
