import { Dispatch } from 'react';
import { UserSeedAction, UserSeed, AddSeedFromBrowseResult } from './seedTypes';
import { BrowseSeed } from '../../browseSeeds/browseTypes';
import { CustomSeedPayload } from '../../customSeedForm/customSeedTypes';
import { ImagePreview } from '../photos/photoTypes';
import { isDuplicateSeed } from './seedUtils';
import { createOptimisticCustomSeed } from '../../customSeedForm/customSeedUtils';
import { uploadImage, getSignedImageUrl } from '../photos/photoQueries';
import { fetchSeedCollection } from './seedQueries';
import { addBrowseSeedToCollection, deleteByCatalogId } from '../../browseSeeds/browseQueries';
import { insertCustomSeed, deleteByCustomId } from '../../customSeedForm/customSeedQueries';
import { createTempId } from '../../app/appUtils';

// Load user seed collection from the database
export async function runLoadUserSeeds(dispatch: Dispatch<UserSeedAction>, userId: string) {
  dispatch({ type: 'LOAD_START', payload: null });
  try {
    const collection = await fetchSeedCollection(userId);
    dispatch({ type: 'LOAD_SUCCESS', payload: collection ?? [] });
  } catch (error) {
    console.error('Error loading user seed collection: ', error);
    console.log('LOAD THE ERROR');
  }
}

// Add a browsed seed to the user collection
export async function runAddSeedFromBrowse(
  dispatch: Dispatch<UserSeedAction>,
  userId: string,
  seeds: UserSeed[],
  browseSeed: BrowseSeed,
): Promise<AddSeedFromBrowseResult> {
  const { id } = browseSeed;

  if (isDuplicateSeed(seeds, id)) return 'duplicate';

  // Optimistic state update
  dispatch({ type: 'ADD_SEED_FROM_BROWSE', payload: browseSeed });

  try {
    await addBrowseSeedToCollection(userId, id);
    return 'added';
  } catch (error) {
    dispatch({ type: 'DELETE_BY_CATALOG_ID', payload: id });
    console.error('Error adding seed from browse:', error);
    return 'failed';
  }
}

// Add a custom seed to the user collection
export async function runAddCustomSeed(
  dispatch: Dispatch<UserSeedAction>,
  userId: string,
  payload: CustomSeedPayload,
  preview: ImagePreview | null,
) {
  // Optimistic state update
  const tempId = createTempId();
  const optimisticSeed = createOptimisticCustomSeed(tempId, payload, preview);

  // Add custom seed to state
  dispatch({ type: 'ADD_CUSTOM_SEED', payload: optimisticSeed });

  try {
    // Upload preview image to storage bucket
    const imagePath = preview ? await uploadImage(userId, preview.mimeType, preview.base64) : null;
    const seedWithImagePath = imagePath ? { ...payload, image: imagePath } : payload;

    // Insert custom seed into database and get the signed URL for the image
    const customSeed = await insertCustomSeed(userId, seedWithImagePath);
    const isImagePath = customSeed.image && !customSeed.image.startsWith('http');
    const signedUrl = isImagePath ? await getSignedImageUrl(customSeed.image) : '';
    const finalCustomSeed = signedUrl ? { ...customSeed, image: signedUrl } : customSeed;

    // Sync state with database insert
    dispatch({ type: 'SYNC_CUSTOM_SEED_WITH_DB', payload: { ...finalCustomSeed, tempId } });
  } catch (error) {
    // Rollback optimistic state update
    dispatch({ type: 'DELETE_BY_CUSTOM_ID', payload: tempId });
    console.error('Error adding custom seed:', error);
  }
}

// Delete a seed from the user collection by catalog ID
export async function runDeleteByCatalogId(dispatch: Dispatch<UserSeedAction>, userId: string, catalogSeedId: string | null) {
  // Optimistic state update
  if (!catalogSeedId) return;
  dispatch({ type: 'DELETE_BY_CATALOG_ID', payload: catalogSeedId });

  try {
    // Database delete
    await deleteByCatalogId(userId, catalogSeedId);
  } catch (error) {
    console.error('Error deleting seed from collection: ', error);
  }
}

// Delete a seed from the user collection by custom ID
export async function runDeleteByCustomId(dispatch: Dispatch<UserSeedAction>, customSeedId: string | null) {
  // Optimistic state update
  if (!customSeedId) return;
  dispatch({ type: 'DELETE_BY_CUSTOM_ID', payload: customSeedId });

  try {
    // Database delete
    await deleteByCustomId(customSeedId);
  } catch (error) {
    console.error('Error deleting seed from collection: ', error);
  }
}
