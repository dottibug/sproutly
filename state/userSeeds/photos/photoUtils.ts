import { UserSeed } from '../seeds/seedTypes';
import { ImagePreview, UserSeedPhoto, GalleryCell } from './photoTypes';
import { getTimestamp } from '../../app/dateUtils';
import * as ImagePicker from 'expo-image-picker';

// photoUtils.ts: Contains utility functions for photos

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
  if (!asset?.base64) return null;

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

// Flatten photos into a single list of GalleryCells
export function flattenPhotos(seeds: UserSeed[]): GalleryCell[] {
  const photos: GalleryCell[] = [];

  for (const seed of seeds) {
    for (const photo of seed.photos ?? []) photos.push({ key: photo.id, photo, seed });
  }
  // Sort photos by createdAt descending
  photos.sort((a, b) => new Date(b.photo.createdAt).getTime() - new Date(a.photo.createdAt).getTime());
  return photos;
}

// Calculate the aspect ratio of a photo (width / height)
export function calculatePhotoAspectRatio(width: number, height: number): number {
  if (width > 0 && height > 0) return width / height;
  return 1;
}

// Get caption for the photo (variety and plant)
export function getPhotoCaption(variety: string, plant: string): string {
  if (!variety && !plant) return '';
  if (variety && plant) return `${variety} ${plant}`;
  if (variety) return variety;
  return plant;
}

// Format the photo date for display (ex. "Mar 23, 2026")
export function formatPhotoDate(iso: string): string {
  const date = new Date(iso);

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
