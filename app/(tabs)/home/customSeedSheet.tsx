import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { useState, useCallback } from 'react';

import { inputStyles, appStyles } from '../../../styles/theme';

import { useAuth } from '../../../state/auth/AuthContext';
import { useCustomSeed } from '../../../state/customSeed/CustomSeedContext';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';
import { ImagePreview } from '../../../state/userSeeds/photos/photoTypes';
import ImagePicker from '../../../components/customSeeds/ImagePicker';
import Input from '../../../components/ui/form/Input';
import { CustomSeedErrors, InfoModalType } from '../../../state/customSeed/customSeedTypes';

import InfoModal from '../../../components/customSeeds/InfoModal';
import { useFocusEffect, useRouter } from 'expo-router';
import { AppButton, ScreenOptions } from '../../../components/uiComponentBarrel';
import { validateCustomSeed } from '../../../components/customSeeds/validateCustomSeed';
import CategorySelectors from '../../../components/customSeeds/CategorySelectors';
import ListSelectors from '../../../components/customSeeds/ListSelectors';
import PlantVarietyInput from '../../../components/customSeeds/PlantVarietyInput';
import CustomInfoAccordion from '../../../components/customSeeds/CustomInfoAccordion';

export default function CustomSeedSheet() {
  const { profile } = useAuth();
  const userId = profile?.id;

  const router = useRouter();
  const customSeed = useCustomSeed();
  const { resetCustomSeed } = customSeed;
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

  // Dismiss plant error when the plant type is changed
  const dismissPlantError = useCallback(() => {
    setErrors((prev) => {
      if (!prev?.plant) return prev;
      const next = { ...prev };
      delete next.plant;
      return Object.keys(next).length ? next : null;
    });
  }, []);

  const infoModalTitle = infoModalType === 'difficulty' ? DIFFICULTY_INFO_TITLE : EXPOSURE_INFO_TITLE;

  // Reset custom seed state when the screen is unfocused (user leaves the screen)
  useFocusEffect(
    useCallback(() => {
      return () => {
        resetCustomSeed();
        setPreview(null);
        setErrors(null);
        setShowInfoModal(false);
        setInfoModalType(null);
      };
    }, [resetCustomSeed]),
  );

  const onSaveSeed = () => {
    if (!userId) return;

    const {
      isValid,
      errors: validationErrors,
      customSeedDraft,
    } = validateCustomSeed(
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
      setErrors(validationErrors);
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
      <ScreenOptions backButtonMode="generic" title="Create Custom Seed" backTitle="Home" />
      <View style={styles.contentContainer}>
        <View style={styles.inputs}>
          <ImagePicker profileId={userId || null} preview={preview} setPreview={setPreview} />
          <PlantVarietyInput errors={errors || {}} onDismissPlantError={dismissPlantError} />
          <CategorySelectors onDismissPlantError={dismissPlantError} />

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

const DESCRIPTION_PLACEHOLDER = 'e.g. Pink and gold with very sweet flavour. Organic heirloom variety.';
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
  },
  inputs: {
    gap: 18,
  },
  inputSection: {
    gap: 12,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 36,
  },
});
