import { ScrollView, View, StyleSheet } from 'react-native';
import { useState } from 'react';

import Button from '../../../components/ui/buttons/Button';
import { colors } from '../../../styles/theme';

import { uploadImage, getSignedSeedImageUrl } from '../../../lib/utils/userSeedImageUtils';
import { useAuth } from '../../../lib/contexts/AuthContext';
import { useCustomSeed } from '../../../lib/contexts/CustomSeedContext';
import { useUserSeeds } from '../../../lib/contexts/UserSeedsContext';
import { PreviewImage } from '../../../lib/types';
import ImagePicker from '../../../components/customSeeds/ImagePicker';
import SeedNameInput from '../../../components/customSeeds/SeedNameInput';
import Heading from '../../../components/ui/Heading';
import SeedTypeSelector from '../../../components/customSeeds/SeedTypeSelector';
import PlantCategoryInput from '../../../components/customSeeds/PlantCategoryInput';
import BeanTypeSelector from '../../../components/customSeeds/BeanTypeSelector';
import LatinInput from '../../../components/customSeeds/LatinInput';
import DifficultySelector from '../../../components/customSeeds/DifficultySelector';
import ExposureSelector from '../../../components/customSeeds/ExposureSelector';
import MaturesInDaysInput from '../../../components/customSeeds/MaturesInDaysInput';
import DescriptionInput from '../../../components/customSeeds/DescriptionInput';
import TimingInput from '../../../components/customSeeds/TimingInput';
import StartingInput from '../../../components/customSeeds/StartingInput';
import GrowingInput from '../../../components/customSeeds/GrowingInput';
import HarvestInput from '../../../components/customSeeds/HarvestInput';
import CompanionPlantingInput from '../../../components/customSeeds/CompanionPlantingInput';

// TODO: Refactor for clarity/organization and make component shorter and more readable
// TODO: image picker should only upload to database on pressing save button
// TODO: Fix the plant menu functionality
// TODO: if the category (plant) is not selected from the menu (is a different type of plant than in database), then show the input fields for planting actions: start indoors (seasons and months), direct sow (seasons and months), transplant (seasons and months)

// TODO: if the bean type is selected, then user switches away from it (ie. it's not a bean type), the bean type needs to be reset to null

// TODO: Export all react components from a single file so this screen is more readable?

export default function AddCustomSeedScreen() {
  const { profile } = useAuth();
  const { saveCustomSeed } = useCustomSeed();
  const { addCustomSeed } = useUserSeeds();

  const [preview, setPreview] = useState<PreviewImage | null>(null);

  // TODO handle no preview image case -- use a placeholder image from a public bucket instead (i.e. don't require users to upload an image)

  // TODO: rename some of these helpers to be clearer about what they are doing; possibly roll into a single helper function so this screen is more readable
  const handleAddSeed = async () => {
    if (!profile?.id) return;
    if (!preview) return;

    try {
      // Upload the preview image to supabase storage bucket
      const imagePath = await uploadImage(profile.id, preview.mimeType, preview.base64);

      // Add the custom seed to the database using the context state
      const newCustomSeed = await saveCustomSeed(imagePath ?? null);

      // Get signed URL for the image if it's a path
      const imageIsPath = newCustomSeed.image && !newCustomSeed.image.startsWith('http');
      const signedUrl = imageIsPath ? await getSignedSeedImageUrl(newCustomSeed.image) : null;
      const customSeedWithSignedImage = signedUrl ? { ...newCustomSeed, image: signedUrl } : newCustomSeed;

      addCustomSeed(customSeedWithSignedImage);
    } catch (error) {
      console.error('Error adding seed:', error);
    }
  };

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

        <SeedNameInput />
        <SeedTypeSelector />
        <PlantCategoryInput />
        <BeanTypeSelector />
        <LatinInput />
        <DifficultySelector />
        <ExposureSelector />
        <MaturesInDaysInput />
        <DescriptionInput />
        <TimingInput />
        <StartingInput />
        <GrowingInput />
        <HarvestInput />
        <CompanionPlantingInput />

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
