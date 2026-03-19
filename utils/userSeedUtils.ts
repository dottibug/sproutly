import { Profile } from '../context/AuthContext';
import { UserSeedItem, BrowseSeedItem, Planting, UserSeedNote } from './types';
import {
  fetchUserSeedsWithoutPlantingActions,
  fetchPlantingActions,
  fetchUserSeedNotesByCollectionId,
  fetchUserSeedPhotosByCollectionId,
} from './queries';
import { getCategoryPlantingActions } from './plantActionUtils';
import { getSignedSeedImageUrl } from './userSeedImageUtils';
import { organizeNotesByCollectionId } from './noteUtils';
import { organizePhotosByCollectionId } from './photoUtils';

export async function getUserSeedCollection(profile: Profile): Promise<UserSeedItem[]> {
  if (!profile?.id) return [];

  const [userSeeds, plantingActions] = await Promise.all([fetchUserSeedsWithoutPlantingActions(profile), fetchPlantingActions()]);

  if (!userSeeds || !plantingActions) throw new Error('Failed to fetch user seeds or planting actions');

  const collection: UserSeedItem[] = userSeeds.map((row: any) => {
    const source = row.seed_catalog ?? row.custom_seeds;
    const category = source?.category ?? '';
    const planting = getCategoryPlantingActions(category, plantingActions);
    return createUserSeedFromDatabase(row, planting);
  });

  const collectionIds = collection.map((seed) => seed.id);
  const [notes, photos] = await Promise.all([
    fetchUserSeedNotesByCollectionId(collectionIds),
    fetchUserSeedPhotosByCollectionId(collectionIds),
  ]);
  const notesByCollectionId = organizeNotesByCollectionId(notes, collectionIds);
  const photosByCollectionId = organizePhotosByCollectionId(photos);

  // Add signed URLs and notes to the collection
  const fullCollection = await Promise.all(
    collection.map(async (seed): Promise<UserSeedItem> => {
      const isCustomSeed = seed.custom_seed_id !== null;
      const imageIsPath = seed.image && !seed.image.startsWith('http');

      const notes = notesByCollectionId[seed.id] ?? [];
      const photos = photosByCollectionId[seed.id] ?? [];

      const signedPhotos = await Promise.all(
        photos.map(async (photo) => {
          const photoPath = photo.imageUrl;
          const photoSignedUrl = photoPath && !photoPath.startsWith('http') ? await getSignedSeedImageUrl(photoPath) : photoPath;
          return { ...photo, imageUrl: photoSignedUrl ?? photoPath };
        }),
      );

      // Get the signed URL for any custom seed images
      if (isCustomSeed && imageIsPath) {
        const signedUrl = await getSignedSeedImageUrl(seed.image);
        return signedUrl ? { ...seed, image: signedUrl, notes } : seed;
      }

      // Add notes to the seed (if any)
      return { ...seed, notes, photos: signedPhotos };
    }),
  );
  return fullCollection;
}

export function isDuplicateSeed(seeds: UserSeedItem[], catalogSeedId: string | null): boolean {
  return seeds.some((s) => s.catalog_seed_id === catalogSeedId);
}

// Helper function to create a user seed object from a database row
export function createUserSeedFromDatabase(row: any, planting: Planting[]): UserSeedItem {
  const source = row.seed_catalog ?? row.custom_seeds;
  if (!source) throw new Error(`User row ${row.id} has no seed data`);

  const newSeed: UserSeedItem = {
    id: row.id,
    catalog_seed_id: row.catalog_seed_id,
    custom_seed_id: row.custom_seed_id,
    notes: row.notes,
    name: source.name,
    sku: source.sku,
    type: source.type,
    bean_type: source.bean_type,
    category: source.category,
    latin: source.latin,
    difficulty: source.difficulty,
    exposure: source.exposure,
    matures_in_days: source.matures_in_days,
    matures_under_days: source.matures_under_days,
    description: source.description,
    timing: source.timing,
    starting: source.starting,
    growing: source.growing,
    harvest: source.harvest,
    companion_planting: source.companion_planting,
    image: source.image,
    planting: planting,
    photos: [],
  };
  return newSeed;
}

// Helper function to create a user seed object from a catalog seed item
export function createUserSeedFromCatalog(seed: BrowseSeedItem) {
  const newSeed: UserSeedItem = {
    id: '',
    catalog_seed_id: seed.id,
    custom_seed_id: null,
    name: seed.name,
    sku: seed.sku,
    type: seed.type,
    bean_type: seed.bean_type,
    category: seed.category,
    latin: seed.latin,
    difficulty: seed.difficulty,
    exposure: seed.exposure,
    matures_in_days: seed.matures_in_days,
    matures_under_days: seed.matures_under_days,
    description: seed.description,
    timing: seed.timing,
    starting: seed.starting,
    growing: seed.growing,
    harvest: seed.harvest,
    companion_planting: seed.companion_planting,
    image: seed.image,
    planting: seed.planting ?? [],
    notes: [],
    photos: [],
  };

  return newSeed;
}

// Helper function to create a user seed object from a custom seed item
export function createUserSeedFromCustom(seed: BrowseSeedItem) {
  const newSeed: UserSeedItem = {
    id: '',
    catalog_seed_id: null,
    custom_seed_id: seed.id,
    name: seed.name,
    sku: seed.sku,
    type: seed.type,
    bean_type: seed.bean_type,
    category: seed.category,
    latin: seed.latin,
    difficulty: seed.difficulty,
    exposure: seed.exposure,
    matures_in_days: seed.matures_in_days,
    matures_under_days: seed.matures_under_days,
    description: seed.description,
    timing: seed.timing,
    starting: seed.starting,
    growing: seed.growing,
    harvest: seed.harvest,
    companion_planting: seed.companion_planting,
    image: seed.image,
    planting: seed.planting ?? [],
    notes: [],
    photos: [],
  };

  return newSeed;
}
