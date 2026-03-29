import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';

import { colors, inputStyles, appStyles } from '../../../styles/theme';

import { useAuth } from '../../../state/auth/AuthContext';
import { useCustomSeed } from '../../../state/customSeed/CustomSeedContext';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';
import { ImagePreview } from '../../../state/userSeeds/photos/photoTypes';
import ImagePicker from '../../../components/customSeeds/ImagePicker';
import Heading from '../../../components/ui/Heading';

import Input from '../../../components/ui/form/Input';
import { CustomSeedErrors, InfoModalType } from '../../../state/customSeed/customSeedTypes';

import InfoModal from '../../../components/customSeeds/InfoModal';
import { Stack, useRouter } from 'expo-router';
import { AppButton, ScreenOptions } from '../../../components/uiComponentBarrel';
import { validateCustomSeed } from '../../../components/customSeeds/validateCustomSeed';
import CategorySelectors from '../../../components/customSeeds/CategorySelectors';
import ListSelectors from '../../../components/customSeeds/ListSelectors';
import PlantVarietyInput from '../../../components/customSeeds/PlantVarietyInput';
import CustomInfoAccordion from '../../../components/customSeeds/CustomInfoAccordion';

// TODO: plant name should be pickable from dropdown menu based on category; but also let user enter a custom plant name

// TODO: if the bean type is selected, then user switches away from it (ie. it's not a bean type), the bean type needs to be reset to null

// TODO: let user enter planting actions if the plant type is not in the database: start indoors (seasons and months), direct sow (seasons and months), transplant (seasons and months)

const DESCRIPTION_PLACEHOLDER = 'e.g. Pink and gold with very sweet flavour. Organic heirloom variety.';

export default function CustomSeedSheet() {
  const { profile } = useAuth();
  const userId = profile?.id;

  const router = useRouter();
  const customSeed = useCustomSeed();
  const { addCustomSeed } = useUserSeed();
  const [preview, setPreview] = useState<ImagePreview | null>(null);

  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [infoModalType, setInfoModalType] = useState<InfoModalType | null>(null);

  /**
   * on form, if there is a preview image, change "add photo" button to "change photo", which will allow a user to change or remove the photo
   *
   * on custom [id] screen, if no image, show a placeholder and an "add image" option so the user can do so at a later point in time
   */

  const [errors, setErrors] = useState<CustomSeedErrors | null>(null);

  const infoModalTitle = infoModalType === 'difficulty' ? DIFFICULTY_INFO_TITLE : EXPOSURE_INFO_TITLE;

  // Set the default values for category, beanType, difficulty, and exposure. Runs once on mount.
  useEffect(() => {
    if (customSeed.seed.category === null) customSeed.setCategory('Vegetable');
    if (customSeed.seed.beanType === null) customSeed.setBeanType('Broad');
    if (customSeed.seed.difficulty === null) customSeed.setDifficulty('Easy');
    if (customSeed.seed.exposure === null) customSeed.setExposure('Full sun');
  }, []);

  const onSaveSeed = () => {
    if (!userId) return;

    const { isValid, errors, customSeedDraft } = validateCustomSeed(
      {
        image: preview?.uri || '',
        variety: customSeed.seed.variety,
        category: customSeed.seed.category,
        plant: customSeed.seed.plant,
        beanType: customSeed.seed.beanType,
        latin: customSeed.seed.latin || null,
        difficulty: customSeed.seed.difficulty || null,
        exposure: customSeed.seed.exposure || null,
        maturesInDays: customSeed.seed.maturesInDays || null,
        description: customSeed.seed.description || null,
        timing: customSeed.seed.timing || null,
        starting: customSeed.seed.starting || null,
        growing: customSeed.seed.growing || null,
        harvest: customSeed.seed.harvest || null,
        companionPlanting: customSeed.seed.companionPlanting || null,
      },
      userId,
    );

    // Creating a new custom seed
    if (!isValid) {
      setErrors(errors);
      return;
    }
    if (customSeedDraft) {
      addCustomSeed(preview, customSeedDraft).catch((error) =>
        Alert.alert('Could not add custom seed', 'Please try again.', [
          { text: 'OK', onPress: () => console.error('Error adding custom seed:', error) },
        ]),
      );
    }

    customSeed.resetCustomSeed();
    router.back();
  };

  const onShowInfoModal = (infoType: InfoModalType) => {
    setShowInfoModal(true);
    setInfoModalType(infoType);
  };

  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
    setInfoModalType(null);
  };

  return (
    <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets keyboardDismissMode="none">
      <ScreenOptions backButtonMode="generic" />
      <View style={styles.contentContainer}>
        <Heading size="small" customStyles={styles.sheetTitle}>
          Create Custom Seed
        </Heading>

        <View style={styles.inputs}>
          <ImagePicker profileId={userId || null} preview={preview} setPreview={setPreview} />
          <PlantVarietyInput errors={errors || {}} />
          <CategorySelectors />

          <View style={[inputStyles.inputSection, appStyles.screenPadding]}>
            <Input
              multiline
              label="Description"
              placeholder={DESCRIPTION_PLACEHOLDER}
              value={customSeed.seed.description || ''}
              onChangeText={(text) => customSeed.setDescription(text)}
            />
          </View>

          <ListSelectors showInfoModal={onShowInfoModal} />
          <CustomInfoAccordion />

          <View style={styles.buttonContainer}>
            <AppButton text="Save Seed" onPress={onSaveSeed} size="small" rounded />
          </View>

          <InfoModal visible={showInfoModal} onRequestClose={handleCloseInfoModal} infoModalType={infoModalType} title={infoModalTitle} />
        </View>
      </View>
    </ScrollView>
  );
}

const DIFFICULTY_INFO_TITLE = 'Difficulty Level';
const EXPOSURE_INFO_TITLE = 'Sun Exposure';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: 17,
    textAlign: 'center',
  },
  contentContainer: {
    gap: 18,
    marginTop: 32,
  },
  inputs: {
    gap: 18,
    marginTop: 8,
  },
  inputSection: {
    gap: 12,
  },
  buttonContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
});
