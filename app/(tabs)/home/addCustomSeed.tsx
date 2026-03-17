import { ScrollView, View, Text, TextInput, StyleSheet } from 'react-native';
import { useState } from 'react';
import { SeedType, Difficulty, Exposure, AddCustomSeedPayload } from '../../../lib/types';
import { SegmentedButtons, Menu, RadioButton } from 'react-native-paper';
import Button from '../../../components/ui/buttons/Button';
import { colors } from '../../../styles/theme';
import DescriptionInputAccordion from '../../../components/accordion/DescriptionInputAccordion';
import TimingInputAccordion from '../../../components/accordion/TimingInputAccordion';
import StartingInputAccordion from '../../../components/accordion/StartingInputAccordion';
import GrowingInputAccordion from '../../../components/accordion/GrowingInputAccordion';
import HarvestInputAccordion from '../../../components/accordion/HarvestInputAccordion';
import CompanionPlantingInputAccordion from '../../../components/accordion/CompanionPlantingInputAccordion';

import { pickAndUploadImage } from '../../../lib/utils/userSeedImageUtils';
import { useAuth } from '../../../lib/contexts/AuthContext';
import { useCustomSeed } from '../../../lib/contexts/CustomSeedContext';
import SeedImagePreview from '../../../components/userSeeds/SeedImagePreview';
import { useUserSeeds } from '../../../lib/contexts/UserSeedsContext';

// TODO: Add image upload
// TODO: if the category (plant) is not selected from the menu (is a different type of plant than in database), then show the input fields for planting actions: start indoors (seasons and months), direct sow (seasons and months), transplant (seasons and months)

const VEGETABLES = [
  'Bean',
  'Beet',
  'Broccoli',
  'Cabbage',
  'Carrot',
  'Cauliflower',
  'Corn',
  'Cucumber',
  'Eggplant',
  'Kale',
  'Lettuce',
  'Onion',
  'Pea',
  'Pepper',
  'Pumpkin',
  'Radish',
  'Spinach',
  'Squash',
  'Tomato',
];

const FLOWERS = [
  'Agastache',
  'Alyssum',
  'Bellis',
  'Calendula',
  'California Poppy',
  'Columbine',
  'Cornflower',
  'Cosmos',
  'Echinacea',
  'Eucalyptus',
  'Foxglove',
  'Marigold',
  'Nasturtium',
  'Poppy',
  'Rudbeckia',
  'Snapdragon',
  'Sunflower',
  'Sweet Pea',
  'Viola',
  'Zinnia',
];

const FRUITS = ['Melon', 'Strawberry'];

const HERBS = [
  'Basil',
  'Bergamot',
  'Chamomile',
  'Chives',
  'Cilantro',
  'Dill',
  'Lavender',
  'Mint',
  'Oregano',
  'Parsley',
  'Rosemary',
  'Sage',
  'Savory',
  'Shiso',
  'Thyme',
];

const DIFFICULTY = ['Easy', 'Standard', 'Intermediate', 'Advanced', 'Expert'];

const EXPOSURE = ['Full sun', 'Full sun to part shade', 'Part shade'];

const DETAILS = ['Description', 'Timing', 'Starting', 'Growing', 'Harvest', 'Companion Planting'];

export default function AddCustomSeedScreen() {
  const { profile } = useAuth();
  const customSeed = useCustomSeed();
  const { addCustomSeed } = useUserSeeds();

  ////
  const { image, setImage } = useCustomSeed();

  // const [seedName, setSeedName] = useState('');
  const [seedType, setSeedType] = useState<SeedType>('Vegetable');
  const [plantMenuVisible, setPlantMenuVisible] = useState(false);
  const [plant, setPlant] = useState('');
  // const [beanType, setBeanType] = useState<'Broad' | 'Bush' | 'Pole'>('Broad');
  // const [latin, setLatin] = useState('');
  // const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  // const [exposure, setExposure] = useState<Exposure>('Full sun');
  // const [maturesInDays, setMaturesInDays] = useState('');

  const openMenu = () => setPlantMenuVisible(true);
  const closeMenu = () => setPlantMenuVisible(false);

  const handleSetPlant = (text: string) => {
    // TODO: if text string matches an entry in the applicable seed type array, scroll to/highlight that entry in the menu
    openMenu();
    setPlant(text);
  };

  const handleAddPhoto = async () => {
    console.log('add photo');
    if (!profile?.id) return;
    const path = await pickAndUploadImage(profile.id);
    console.log('path', path);
    if (path) setImage(path);
  };

  const handleAddSeed = async () => {
    console.log('add seed');
    try {
      const newCustomSeed = await customSeed.saveCustomSeed();
      console.log('newCustomSeed', newCustomSeed);
      addCustomSeed(newCustomSeed);
    } catch (error) {
      console.error('Error adding seed:', error);
    }
  };

  const PlantMenu: React.ReactNode = (
    <TextInput placeholder="Bean, Tomato,etc." value={plant} onChangeText={handleSetPlant} style={styles.input} />
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator>
      <View style={styles.content}>
        <Text>Add Custom Seed Screen</Text>

        <View>
          <Text>Add Photo</Text>
          <SeedImagePreview path={image} />
          <Button text="Add Photo" onPress={handleAddPhoto} size="small" />
        </View>

        <View>
          <Text>Seed Name</Text>
          <TextInput placeholder="Seed Name" value={customSeed.name} onChangeText={customSeed.setName} style={styles.input} />
        </View>

        <View>
          <Text>Seed Type</Text>
          <SegmentedButtons
            value={customSeed.type}
            onValueChange={customSeed.setType}
            buttons={[
              { value: 'Vegetable', label: 'Veggie' },
              { value: 'Flower', label: 'Flower' },
              { value: 'Fruit', label: 'Fruit' },
              { value: 'Herb', label: 'Herb' },
            ]}
          />
        </View>

        <View>
          <Text>Plant</Text>
          <Menu visible={plantMenuVisible} onDismiss={closeMenu} anchor={PlantMenu} anchorPosition="bottom">
            {customSeed.type === 'Vegetable' &&
              VEGETABLES.map((p) => <Menu.Item key={p} title={p} onPress={() => customSeed.setCategory(p)} />)}
            {customSeed.type === 'Flower' && FLOWERS.map((p) => <Menu.Item key={p} title={p} onPress={() => customSeed.setCategory(p)} />)}
            {customSeed.type === 'Fruit' && FRUITS.map((p) => <Menu.Item key={p} title={p} onPress={() => customSeed.setCategory(p)} />)}
            {customSeed.type === 'Herb' && HERBS.map((p) => <Menu.Item key={p} title={p} onPress={() => customSeed.setCategory(p)} />)}
          </Menu>
        </View>

        <View>
          <Text>Bean Type</Text>
          <SegmentedButtons
            value={customSeed.beanType || ''}
            onValueChange={(value) => customSeed.setBeanType(value as 'Broad' | 'Bush' | 'Pole' | null)}
            buttons={[
              { value: 'Broad', label: 'Broad' },
              { value: 'Bush', label: 'Bush' },
              { value: 'Pole', label: 'Pole' },
            ]}
          />
        </View>

        <View>
          <Text>Latin</Text>
          <TextInput
            placeholder="Latin"
            value={customSeed.latin || ''}
            onChangeText={(text) => customSeed.setLatin(text || null)}
            style={styles.input}
          />
        </View>

        <View>
          <Text>Difficulty</Text>
          <RadioButton.Group value={customSeed.difficulty || ''} onValueChange={(value) => customSeed.setDifficulty(value as Difficulty)}>
            {DIFFICULTY.map((d) => (
              <RadioButton.Item
                key={d}
                label={d}
                value={d as Difficulty}
                style={{ backgroundColor: d === customSeed.difficulty ? colors.lightGray : colors.white }}
              />
            ))}
          </RadioButton.Group>
        </View>

        <View>
          <Text>Exposure</Text>
          <RadioButton.Group value={customSeed.exposure || ''} onValueChange={(value) => customSeed.setExposure(value as Exposure)}>
            {EXPOSURE.map((e) => (
              <RadioButton.Item
                key={e}
                label={e}
                value={e as Exposure}
                style={{ backgroundColor: e === customSeed.exposure ? colors.lightGray : colors.white }}
              />
            ))}
          </RadioButton.Group>
        </View>

        <View>
          <Text>Matures In Days</Text>
          <TextInput
            placeholder="Matures In Days"
            value={customSeed.maturesInDays?.toString() || ''}
            onChangeText={(text) => customSeed.setMaturesInDays(text ? Number.parseInt(text) : null)}
            inputMode="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.detailsContainer}>
          <Text>Details</Text>
          <DescriptionInputAccordion />
          <TimingInputAccordion />
          <StartingInputAccordion />
          <GrowingInputAccordion />
          <HarvestInputAccordion />
          <CompanionPlantingInputAccordion />
        </View>

        <View>
          <Button text="Add Seed" onPress={handleAddSeed} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
    // paddingBottom: 320,
  },
  content: {
    gap: 24,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 9,
    fontSize: 16,
    padding: 12,
  },
  detailsContainer: {
    gap: 24,
    marginVertical: 24,
  },
});
