import { Dispatch } from 'react';
import { UserSeedAction, UserSeed } from '../types/seedTypes';
import { BrowseSeed } from '../../browseSeeds/browseTypes';
import { CustomSeedPayload } from '../../customSeeds/customSeedTypes';
import { ImagePreview } from '../types/photoTypes';
import { isDuplicateSeed } from '../utils/seedUtils';
import { uploadImage, getSignedImageUrl } from '../queries/photoQueries';
import { fetchSeedCollection } from '../queries/seedQueries';
import { addBrowseSeedToCollection, deleteByCatalogId } from '../../browseSeeds/browseQueries';
import { insertCustomSeed, deleteByCustomId } from '../../customSeeds/customSeedQueries';

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
export async function runAddSeedFromBrowse(dispatch: Dispatch<UserSeedAction>, userId: string, seeds: UserSeed[], browseSeed: BrowseSeed) {
  const { id } = browseSeed;

  if (isDuplicateSeed(seeds, id)) return;

  // Optimistic state update
  dispatch({ type: 'ADD_SEED_FROM_BROWSE', payload: browseSeed });

  try {
    // Database insert
    const newUserSeed = await addBrowseSeedToCollection(userId, id);
  } catch (error) {
    // Rollback optimistic state update
    dispatch({ type: 'DELETE_BY_CATALOG_ID', payload: id });
    console.error('Error adding seed from browse:', error);
  }
}

// Add a custom seed to the user collection
export async function runAddCustomSeed(
  dispatch: Dispatch<UserSeedAction>,
  userId: string,
  payload: CustomSeedPayload,
  preview: ImagePreview | null,
) {
  // Upload preview image to storage bucket
  const imagePath = preview ? await uploadImage(userId, preview.mimeType, preview.base64) : null;

  // Insert custom seed into database (both custom_seeds and user_seed_collection tables)
  const seedWithImagePath = imagePath ? { ...payload, image: imagePath } : payload;

  const customSeed = await insertCustomSeed(userId, seedWithImagePath);

  // Get signed URL for the imagePath
  const isImagePath = customSeed.image && !customSeed.image.startsWith('http');

  const signedUrl = isImagePath ? await getSignedImageUrl(customSeed.image) : '';

  const customSeedWithImageUrl = signedUrl ? { ...customSeed, image: signedUrl } : customSeed;

  // Add custom seed to state
  dispatch({ type: 'ADD_CUSTOM_SEED', payload: customSeedWithImageUrl });
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
