import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const CATALOG_STORAGE_KEY = '@sproutly/seed_catalog';

export type SeedType = 'Vegetable' | 'Flower' | 'Fruit' | 'Herb';

export type Exposure = 'Full sun' | 'Part sun' | 'Full sun to part shade' | 'Part shade' | 'Shade';

export type Difficulty = 'Easy' | 'Standard' | 'Intermediate' | 'Advanced' | 'Expert';

export type PlantingAction = 'start_indoors' | 'direct_sow' | 'transplant';

export type Planting = {
  action: PlantingAction;
  seasons: string[];
  months: number[];
};

export type PlantingActionRow = {
  plant: string;
  variant: string | null;
  action: PlantingAction;
  seasons: string[];
  months: number[];
};

export type CatalogSeedItem = {
  id: string;
  name: string;
  sku: string;
  type: SeedType;
  bean_type: string | null;
  category: string;
  latin: string | null;
  difficulty: string | null;
  exposure: string | null;
  matures_in_days: number | null;
  matures_under_days: number | null;
  description: string | null;
  timing: string | null;
  starting: string | null;
  growing: string | null;
  harvest: string | null;
  companion_planting: string | null;
  image: string;
  planting: Planting[];
};

export type UserSeedItem = {
  id: string;
  catalog_seed_id: string | null;
  custom_seed_id: string | null;
  name: string;
  sku: string;
  type: SeedType;
  bean_type: string | null;
  category: string;
  latin: string | null;
  difficulty: string | null;
  exposure: string | null;
  matures_in_days: number | null;
  matures_under_days: number | null;
  description: string | null;
  timing: string | null;
  starting: string | null;
  growing: string | null;
  harvest: string | null;
  companion_planting: string | null;
  planting: Planting[];
  image: string;
  notes: string | null;
};

// Match category data from the seed_catalog table to plant data from the planting_actions table (ex. 'Sweet pea' to 'sweet pea')
export function categoryPlantMatch(value: string): string {
  return value.toLowerCase().trim();
}

// Match bean type data from the seed_catalog table to the variant data from the planting_actions table ('Bush' and 'Pole' to 'bush_pole'; 'Broad' to 'broad')
function beanVariantMatch(category: string, beanType: string | null): string | null {
  // only beans have variants
  if (categoryPlantMatch(category) !== 'bean') return null;
  const bean = beanType?.toLowerCase().trim();
  if (bean === 'bush' || bean === 'pole') return 'bush_pole';
  if (bean === 'broad') return 'broad';
  return null;
}

// Get the planting actions from the database
export async function fetchPlantingActions(): Promise<PlantingActionRow[]> {
  const { data, error } = await supabase.from('planting_actions').select('plant, variant, action, seasons, months');
  if (error) throw error;
  return (data ?? []) as PlantingActionRow[];
}

// Get the planting actions for a given category (and bean type, if applicable)
export function getCategoryPlantingActions(category: string, rows: PlantingActionRow[], beanType: string | null = null): Planting[] {
  const plant = categoryPlantMatch(category);
  const variant = beanVariantMatch(category, beanType);

  return rows
    .filter((action) => {
      if (categoryPlantMatch(action.plant) !== plant) return false;
      if (variant === null) return action.variant === null;
      return action.variant === variant;
    })
    .map((action) => ({
      action: action.action,
      seasons: action.seasons ?? [],
      months: action.months ?? [],
    }));
}

// Get the cached seed catalog from AsyncStorage
async function getCachedSeedCatalog(): Promise<CatalogSeedItem[] | null> {
  try {
    const data = await AsyncStorage.getItem(CATALOG_STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data) as CatalogSeedItem[];

    // Check that the parsed data is an array
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    console.error('Error getting cached seed catalog:', error);
    return null;
  }
}

// Set the cached seed catalog in AsyncStorage
async function setCachedSeedCatalog(items: CatalogSeedItem[]): Promise<void> {
  await AsyncStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(items));
}

// Fetch the seed catalog from the database (alphabetical order by name)
async function fetchSeedCatalog(): Promise<CatalogSeedItem[]> {
  const [catalogData, plantingData] = await Promise.all([
    supabase
      .from('seed_catalog')
      .select(
        'id, name, sku, type, bean_type, category, latin, difficulty, exposure, matures_in_days, matures_under_days, description, timing, starting, growing, harvest, companion_planting, image',
      )
      .order('name', { ascending: true }),
    fetchPlantingActions(),
  ]);

  if (catalogData.error) throw catalogData.error;

  // https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys
  const catalog = (catalogData.data ?? []) as Omit<CatalogSeedItem, 'planting'>[];

  return catalog.map((seed) => {
    return {
      ...seed,
      planting: getCategoryPlantingActions(seed.category, plantingData, seed.bean_type),
    };
  });
}

// Get the seed catalog from the database or cache. Only fetches from database if the cache is empty. Caching limits the number of database queries and supports offline use.
export async function getSeedCatalog(): Promise<CatalogSeedItem[]> {
  const cached = await getCachedSeedCatalog();
  if (cached && cached.length > 0) return cached;
  const catalog = await fetchSeedCatalog();
  await setCachedSeedCatalog(catalog);
  return catalog;
}

// For testing purposes. Clear the cached seed catalog.
export async function clearSeedCatalogCache(): Promise<void> {
  await AsyncStorage.removeItem(CATALOG_STORAGE_KEY);
}
