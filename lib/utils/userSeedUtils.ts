import { Profile } from '../contexts/AuthContext';
import { UserSeedItem, CatalogSeedItem, Planting, PreviewImage } from '../types';
import { fetchUserSeedsWithoutPlantingActions, fetchPlantingActions } from '../queries';
import { getCategoryPlantingActions } from './plantActionUtils';
import { getSignedSeedImageUrl, uploadImage } from './userSeedImageUtils';

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

  // Get the signed URL for any custom seed images (required for access to private Supabase storage buckets; tokens expire after 1 hour)
  const collectionWithSignedImages = await Promise.all(
    collection.map(async (seed): Promise<UserSeedItem> => {
      const isCustomSeed = seed.custom_seed_id !== null;
      const imageIsPath = seed.image && !seed.image.startsWith('http');
      if (isCustomSeed && imageIsPath) {
        const signedUrl = await getSignedSeedImageUrl(seed.image);
        return signedUrl ? { ...seed, image: signedUrl } : seed;
      }
      return seed;
    }),
  );

  return collectionWithSignedImages;
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
  };
  return newSeed;
}

// Helper function to create a user seed object from a catalog seed item
export function createUserSeedFromCatalog(seed: CatalogSeedItem) {
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
    notes: null,
  };

  return newSeed;
}

// Helper function to create a user seed object from a custom seed item
export function createUserSeedFromCustom(seed: CatalogSeedItem) {
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
    notes: null,
  };

  return newSeed;
}
