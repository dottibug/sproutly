import { supabase } from '../app/supabase';
import { BrowseSeed } from './browseTypes';
import { fetchPlantingActions } from '../userSeeds/seeds/seedQueries';
import { attachPlantingToSeeds, mapCatalogRowToBrowseSeed } from './browseUtils';
import { UserSeed } from '../userSeeds/seeds/seedTypes';

const CATALOG_SELECT = `
  id, variety, sku, category, bean_type, plant, latin, difficulty, exposure, matures_in_days, matures_under_days, description, timing, starting, growing, harvest, companion_planting, image
`;

// Fetch the seeds in the catalog
async function fetchCatalogSeeds(): Promise<BrowseSeed[]> {
  const { data, error } = await supabase.from('seed_catalog').select(CATALOG_SELECT).order('variety', { ascending: true });

  if (error) throw error;

  return data?.map((row) => mapCatalogRowToBrowseSeed(row)) ?? ([] as BrowseSeed[]);
}

// Fetch the catalog from the database (alphabetical order by name)
export async function fetchCatalog(): Promise<BrowseSeed[]> {
  let collection: BrowseSeed[] = [];

  // Fetch seeds in the catalog and planting actions
  const [seeds, plantingActions] = await Promise.all([fetchCatalogSeeds(), fetchPlantingActions()]);

  // Attach the planting actions to the seeds
  return attachPlantingToSeeds(seeds, plantingActions);
}

// Add a browsed seed to the user collection
export async function addBrowseSeedToCollection(userId: string, browseSeedId: string): Promise<UserSeed> {
  const { data, error } = await supabase
    .from('user_seed_collection')
    .insert({
      user_id: userId,
      catalog_seed_id: browseSeedId,
    })
    .select('*')
    .single();

  if (error) throw error;

  return {
    id: data.id,
    catalogSeedId: data.catalog_seed_id,
    customSeedId: null,
    variety: data.variety,
    sku: data.sku,
    category: data.category,
    beanType: data.bean_type,
  } as UserSeed;
}

// Delete a seed from the user collection
export async function deleteByCatalogId(userId: string, catalogSeedId: string): Promise<void> {
  const { error } = await supabase.from('user_seed_collection').delete().eq('user_id', userId).eq('catalog_seed_id', catalogSeedId);
  if (error) throw error;
}
