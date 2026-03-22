import { Dispatch } from 'react';
import { UserSeedAction } from '../types/seedTypes';
import { createTempId, getTimestamp } from '../../app/appUtils';
import { buildUserSeedPhoto, selectImage } from '../utils/photoUtils';
import { uploadImage, getSignedImageUrl, insertPhoto, deletePhoto } from '../queries/photoQueries';
import { AddPhotoDraft } from '../types/photoTypes';

// Add a photo to state and database
export async function runAddPhoto(dispatch: Dispatch<UserSeedAction>, userId: string, draft: AddPhotoDraft) {
  const { userSeedId, preview } = draft;
  const selectedImage = preview ?? (await selectImage());
  if (!selectedImage) return;

  const tempId = createTempId();
  const now = getTimestamp();

  const photoPreview = buildUserSeedPhoto(tempId, userId, draft.userSeedId, selectedImage.uri, now);

  dispatch({ type: 'ADD_PHOTO', payload: { ...photoPreview, tempId } });

  try {
    // Database insert
    const imagePath = await uploadImage(userId, selectedImage.mimeType, selectedImage.base64);

    if (!imagePath) throw new Error('Failed to upload photo');

    const insertedPhoto = await insertPhoto(userId, draft.userSeedId, imagePath);

    const signedUrl = await getSignedImageUrl(insertedPhoto.imageUri);

    const photoWithSignedUrl = signedUrl ? { ...insertedPhoto, imageUri: signedUrl } : insertedPhoto;

    dispatch({
      type: 'SYNC_PHOTO_WITH_DB',
      payload: {
        ...photoWithSignedUrl,
        tempId,
      },
    });
  } catch (error) {
    dispatch({ type: 'DELETE_PHOTO', payload: tempId });
    console.error('Error adding photo to seed: ', error);
  }
}

// Delete a photo in state and database
export async function runDeletePhoto(dispatch: Dispatch<UserSeedAction>, userId: string, photoId: string) {
  // Optimistic state update
  if (photoId.startsWith('temp-')) return;
  dispatch({ type: 'DELETE_PHOTO', payload: photoId });

  try {
    // Database delete
    await deletePhoto(userId, photoId);
  } catch (error) {
    console.error('Error deleting photo from seed: ', error);
  }
}
