import { ScrollView, View, StyleSheet, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '../../../state/auth/AuthContext';
import { useCustomSeed, useUserSeed } from '../../../state/barrels/contextBarrel';
import { ImagePreview, CustomSeedErrors, InfoModalType } from '../../../state/barrels/typesBarrel';
import { AppButton, ScreenOptions, Input } from '../../../components/uiComponentBarrel';
import ImagePicker from '../../../components/customSeeds/ImagePicker';
import InfoModal from '../../../components/customSeeds/InfoModal';
import PlantVarietyInput from '../../../components/customSeeds/PlantVarietyInput';
import CategorySelectors from '../../../components/customSeeds/CategorySelectors';
import ListSelectors from '../../../components/customSeeds/ListSelectors';
import CustomInfoAccordion from '../../../components/customSeeds/CustomInfoAccordion';
import { validateCustomSeed } from '../../../components/customSeeds/validateCustomSeed';
import { inputStyles, appStyles } from '../../../styles/theme';

// (tabs)/home/customSeedSheet.tsx: Screen for creating a custom seed.

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
  const [errors, setErrors] = useState<CustomSeedErrors | null>(null);

  const infoModalTitle = infoModalType === 'difficulty' ? DIFFICULTY_INFO_TITLE : EXPOSURE_INFO_TITLE;

  // Dismiss plant error when the plant type is changed
  const dismissPlantError = useCallback(() => {
    setErrors((prev) => {
      if (!prev?.plant) return prev;
      const next = { ...prev };
      delete next.plant;
      return Object.keys(next).length ? next : null;
    });
  }, []);

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

// ---- CONSTANTS ----
const DESCRIPTION_PLACEHOLDER = 'e.g. Pink and gold with very sweet flavour. Organic heirloom variety.';
const DIFFICULTY_INFO_TITLE = 'Difficulty Level';
const EXPOSURE_INFO_TITLE = 'Sun Exposure';

// ---- STYLES ----
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
