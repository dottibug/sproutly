import { UserSeed } from '../seeds/seedTypes';
import { ImagePreview, UserSeedPhoto } from './photoTypes';
import { getTimestamp } from '../../app/appUtils';
import * as ImagePicker from 'expo-image-picker';

export function buildUserSeedPhoto(id: string, userId: string, userSeedId: string, imageUri: string, createdAt: string): UserSeedPhoto {
  return { id, userId, userSeedId, imageUri, createdAt } as UserSeedPhoto;
}

// Create a photo in the UI (optimistic update)
export function createPhoto(seeds: UserSeed[], payload: UserSeedPhoto & { tempId: string }) {
  const seedsCopy = [...seeds];
  const { userId, userSeedId, tempId, imageUri } = payload;

  const updated = seedsCopy.map((s) => {
    if (s.id !== userSeedId) return s;

    const currentPhotos = s.photos ?? [];
    const now = getTimestamp();

    const newPhoto = buildUserSeedPhoto(tempId, userId, userSeedId, imageUri, now);

    return { ...s, photos: [...currentPhotos, newPhoto] };
  });

  return updated;
}

// Replace the optimistic photo in the UI with the successful DB insert (ensures the photo id is updated in the UI)
export function replaceUIPhoto(seeds: UserSeed[], payload: UserSeedPhoto & { tempId: string }) {
  const seedsCopy = [...seeds];
  const updated = seedsCopy.map((seed) => {
    const currentPhotos = seed.photos ?? [];
    const hasTempPhoto = currentPhotos.some((p) => p.id === payload.tempId);
    if (!hasTempPhoto) return seed;

    // For this current user session, keep the local URI to avoid visual flicker. The signed URL will be used in the next user session.
    return {
      ...seed,
      photos: currentPhotos.map((photo) =>
        photo.id === payload.tempId
          ? ({
              ...payload,
              imageUri: photo.imageUri,
              userSeedId: payload.userSeedId || photo.userSeedId,
            } as UserSeedPhoto)
          : photo,
      ),
    };
  });
  return updated;
}

// Delete a photo in the UI (optimistic update)
export function deleteByPhotoId(seeds: UserSeed[], photoId: string) {
  const seedsCopy = [...seeds];
  const updated = seedsCopy.map((s) => {
    const currentPhotos = s.photos ?? [];
    return {
      ...s,
      photos: currentPhotos.filter((p) => p.id !== photoId),
    } as UserSeed;
  });
  return updated;
}

// Restore a photo in the UI (if it failed to be successfully deleted in the DB)
export function restorePhoto(seeds: UserSeed[], photo: UserSeedPhoto) {
  const seedsCopy = [...seeds];
  const updated = seedsCopy.map((s) => {
    if (s.id !== photo.userSeedId) return s;
    const currentPhotos = s.photos ?? [];
    return {
      ...s,
      photos: [...currentPhotos, photo],
    } as UserSeed;
  });
  return updated;
}

// Pick an image from the device and return the local URI and path
export async function selectImage(): Promise<ImagePreview | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    base64: true,
  });

  if (result.canceled) return null;

  const asset = result.assets[0];
  if (!asset?.base64) {
    console.log('Picked image missing base64 data');
    return null;
  }

  return {
    uri: asset.uri,
    mimeType: asset.mimeType,
    base64: asset.base64,
  } as ImagePreview;
}

// Group photos by userSeedId (key is userSeedId)
export function groupPhotosByUserSeedId(photos: UserSeedPhoto[]): Map<string, UserSeedPhoto[]> {
  const map = new Map<string, UserSeedPhoto[]>();

  photos.forEach((photo) => {
    if (!map.has(photo.userSeedId)) map.set(photo.userSeedId, []);
    map.get(photo.userSeedId)?.push(photo);
  });

  return map;
}
