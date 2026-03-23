import { ScrollView, View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';

import Button from '../../../components/ui/buttons/AppButton';
import { colors } from '../../../styles/theme';

import { useAuth } from '../../../state/app/AuthContext';
import { useCustomSeedForm } from '../../../state/customSeedForm/CustomSeedFormContext';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';
import { ImagePreview } from '../../../state/userSeeds/photos/photoTypes';
import ImagePicker from '../../../components/customSeeds/ImagePicker';
import Heading from '../../../components/ui/Heading';

// import PlantInput from '../../../components/customSeeds/PlantInput';

import { createCustomSeedPayload } from '../../../state/customSeedForm/customSeedUtils';

import Input from '../../../components/form/Input';
import { CustomSeedFormErrors } from '../../../state/customSeedForm/customSeedTypes';
import { cleanCustomSeedForm, isValid, validateCustomSeedForm } from '../../../components/customSeeds/helpers/validateCustomSeedForm';
import ButtonSelector from '../../../components/form/ButtonSelector';
import { BeanType, Category, Difficulty, DIFFICULTY, Exposure, EXPOSURE } from '../../../state/userSeeds/seeds/seedInfoTypes';
import ListSelector from '../../../components/form/ListSelector';
import IconButton from '../../../components/ui/buttons/IconButton';
import AppModal from '../../../components/ui/AppModal';

import InfoModal from '../../../components/customSeeds/InfoModal';
import { useRouter } from 'expo-router';

// TODO: plant name should be pickable from dropdown menu based on category; but also let user enter a custom plant name

// TODO: if the bean type is selected, then user switches away from it (ie. it's not a bean type), the bean type needs to be reset to null

// TODO: let user enter planting actions if the plant type is not in the database: start indoors (seasons and months), direct sow (seasons and months), transplant (seasons and months)

const DESCRIPTION_PLACEHOLDER =
  'Orange skin streaked with pink and gold. Very sweet flavour. Keep the vines well picked for  fruit right through late summer. Indeterminate. Organic heirloom variety.';

const TIMING_PLACEHOLDER =
  'Start indoors in early spring over bottom heat. Grow seedlings on for 6-8 weeks. Transplant out when night time lows are 10°C or warmer.';

const STARTING_PLACEHOLDER = 'Sow seeds 5mm-1cm (¼-½”) deep. Keep seedlings under very bright light to prevent legginess';

const GROWING_PLACEHOLDER = 'Use fertile, well-drained soil rich in organic matter. Require full sun and lots of heat. Remove any suckers.';

const HARVEST_PLACEHOLDER = 'Harvest when the fruit is the desired colour. Green tomatoes can be ripened indoors. ';

const COMPANION_PLANTING_PLACEHOLDER =
  'Tomatoes benefit from basil, chives, nasturtium, and peppers. Do not plant neary walnut trees. Kohlrabi will stunt growth. Potatoes may spread blight to tomatoes.';

export default function AddCustomSeedScreen() {
  const { profile } = useAuth();
  const router = useRouter();
  const customSeed = useCustomSeedForm();
  const { addCustomSeed } = useUserSeed();
  const [preview, setPreview] = useState<ImagePreview | null>(null);

  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [infoModalType, setInfoModalType] = useState<infoModal | null>(null);

  // TODO handle no preview image case -- use a placeholder image from a public bucket instead (i.e. don't require users to upload an image)

  /**
   * on form, if there is a preview image, change "add photo" button to "change photo", which will allow a user to change or remove the photo
   *
   * on custom [id] screen, if no image, show a placeholder and an "add image" option so the user can do so at a later point in time
   */

  const [errors, setErrors] = useState<CustomSeedFormErrors>({});

  // Set the default values for category, beanType, difficulty, and exposure. Runs once on mount.
  useEffect(() => {
    if (customSeed.seed.category === null) customSeed.setCategory('Vegetable');
    if (customSeed.seed.beanType === null) customSeed.setBeanType('Broad');
    if (customSeed.seed.difficulty === null) customSeed.setDifficulty('Easy');
    if (customSeed.seed.exposure === null) customSeed.setExposure('Full sun');
  }, []);

  const handleAddSeed = () => {
    console.log('handleAddSeed called');
    if (!profile?.id) return;

    const errors = validateCustomSeedForm({
      image: preview?.uri || '',
      variety: customSeed.seed.variety,
      category: customSeed.seed.category,
      plant: customSeed.seed.plant,
      beanType: customSeed.seed.beanType,
    });

    setErrors(errors);
    if (!isValid(errors)) return;
    const cleanedCustomSeed = cleanCustomSeedForm(customSeed.seed);
    const payload = createCustomSeedPayload(cleanedCustomSeed);

    // Do not await database insert
    addCustomSeed(preview, payload).catch((error) => console.error('Add custom seed failed after navigation to home screen', error));

    customSeed.resetCustomSeed();
    router.back();
  };

  const categoryOptions = [
    { value: 'Vegetable', label: 'Veggie' },
    { value: 'Flower', label: 'Flower' },
    { value: 'Fruit', label: 'Fruit' },
    { value: 'Herb', label: 'Herb' },
  ];

  const beanTypeOptions = [
    { value: 'Broad', label: 'Broad' },
    { value: 'Bush', label: 'Bush' },
    { value: 'Pole', label: 'Pole' },
  ];

  const difficultyOptions = DIFFICULTY.map((difficulty) => ({ value: difficulty, label: difficulty }));
  const exposureOptions = EXPOSURE.map((exposure) => ({ value: exposure, label: exposure }));
  const showBeanTypeSelector = customSeed.seed.category === 'Vegetable' && customSeed.seed.plant.toLowerCase() === 'bean';

  type infoModal =
    | 'difficulty'
    | 'exposure'
    | 'maturesInDays'
    | 'description'
    | 'timing'
    | 'starting'
    | 'growing'
    | 'harvest'
    | 'companionPlanting';

  const handleShowInfoModal = (infoType: infoModal) => {
    setShowInfoModal(true);
    setInfoModalType(infoType);
  };

  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
    setInfoModalType(null);
  };

  // console.log('customSeed in addCustomSeed.tsx: ', customSeed);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator>
      <View style={styles.content}>
        <Heading size="medium">Add Custom Seed</Heading>

        <ImagePicker profileId={profile?.id || null} preview={preview} setPreview={setPreview} />

        <Input
          required
          label="Variety Name"
          placeholder="e.g. Sunrise Bumblebee"
          value={customSeed.seed.variety}
          onChangeText={(text) => customSeed.setVariety(text)}
          hasError={Boolean(errors.variety)}
          errorMessage={errors.variety ?? ''}
        />

        <Input
          required
          label="Plant Type"
          placeholder="e.g. Tomato"
          value={customSeed.seed.plant}
          onChangeText={(text) => customSeed.setPlant(text)}
          hasError={Boolean(errors.plant)}
          errorMessage={errors.plant ?? ''}
        />

        <Input
          label="Latin Name"
          placeholder="e.g. Solanum lycopersicum"
          value={customSeed.seed.latin || ''}
          onChangeText={(text) => customSeed.setLatin(text)}
        />

        <ButtonSelector
          title="Category"
          options={categoryOptions}
          value={customSeed.seed.category}
          onValueChange={(value) => customSeed.setCategory(value as Category)}
        />

        <ButtonSelector
          disabled={!showBeanTypeSelector}
          title="Bean Type"
          options={beanTypeOptions}
          value={(customSeed.seed.beanType as BeanType) || ''}
          onValueChange={(value) => customSeed.setBeanType(value as BeanType)}
        />

        <ListSelector
          title="Difficulty"
          value={customSeed.seed.difficulty}
          onValueChange={(value) => customSeed.setDifficulty(value as Difficulty)}
          options={difficultyOptions}
          showInfoIcon={true}
          onIconPress={() => handleShowInfoModal('difficulty')}
        />

        <ListSelector
          title="Exposure"
          value={customSeed.seed.exposure}
          onValueChange={(value) => customSeed.setExposure(value as Exposure)}
          options={exposureOptions}
          showInfoIcon={true}
          onIconPress={() => handleShowInfoModal('exposure')}
        />

        <Input
          label="Matures In Days"
          placeholder="e.g. 70"
          value={customSeed.seed.maturesInDays?.toString() || ''}
          onChangeText={(text) => customSeed.setMaturesInDays(text ? Number.parseInt(text) : null)}
          inputMode="numeric"
          showInfoIcon={true}
          onIconPress={() => handleShowInfoModal('maturesInDays')}
        />

        <Input
          multiline
          label="Description"
          placeholder={DESCRIPTION_PLACEHOLDER}
          value={customSeed.seed.description || ''}
          onChangeText={(text) => customSeed.setDescription(text)}
          showInfoIcon={true}
          onIconPress={() => handleShowInfoModal('description')}
        />

        <Input
          multiline
          label="Timing"
          placeholder={TIMING_PLACEHOLDER}
          value={customSeed.seed.timing || ''}
          onChangeText={(text) => customSeed.setTiming(text)}
          showInfoIcon={true}
          onIconPress={() => handleShowInfoModal('timing')}
        />

        <Input
          multiline
          label="Starting"
          placeholder={STARTING_PLACEHOLDER}
          value={customSeed.seed.starting || ''}
          onChangeText={(text) => customSeed.setStarting(text)}
          showInfoIcon={true}
          onIconPress={() => handleShowInfoModal('starting')}
        />

        <Input
          multiline
          label="Growing"
          placeholder={GROWING_PLACEHOLDER}
          value={customSeed.seed.growing || ''}
          onChangeText={(text) => customSeed.setGrowing(text)}
          showInfoIcon={true}
          onIconPress={() => handleShowInfoModal('growing')}
        />

        <Input
          multiline
          label="Harvest"
          placeholder={HARVEST_PLACEHOLDER}
          value={customSeed.seed.harvest || ''}
          onChangeText={(text) => customSeed.setHarvest(text)}
          showInfoIcon={true}
          onIconPress={() => handleShowInfoModal('harvest')}
        />

        <Input
          multiline
          label="Companion Planting"
          placeholder={COMPANION_PLANTING_PLACEHOLDER}
          value={customSeed.seed.companionPlanting || ''}
          onChangeText={(text) => customSeed.setCompanionPlanting(text)}
          showInfoIcon={true}
          onIconPress={() => handleShowInfoModal('companionPlanting')}
        />

        <View>
          <Button text="Add Seed" onPress={handleAddSeed} />
        </View>

        <InfoModal visible={showInfoModal} onRequestClose={handleCloseInfoModal} infoModalType={infoModalType} />
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
    marginTop: 24,
    paddingBottom: 24,
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
