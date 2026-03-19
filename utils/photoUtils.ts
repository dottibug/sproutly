import { UserSeedPhoto } from './types';

// Create array of photos for each seed in a user's collection
export function organizePhotosByCollectionId(photos: UserSeedPhoto[]): Record<string, UserSeedPhoto[]> {
  return photos.reduce<Record<string, UserSeedPhoto[]>>((acc, photo) => {
    if (!acc[photo.userCollectionId]) acc[photo.userCollectionId] = [];
    acc[photo.userCollectionId].push(photo);
    return acc;
  }, {});
}
