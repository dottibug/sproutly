// ---- PROFILE TYPES ----
export type Profile = {
  id: string;
  username: string;
};

// ---- SEED INFO TYPES ----
export type SeedType = 'Vegetable' | 'Flower' | 'Fruit' | 'Herb';

export type PlantType = 'Veggie' | 'Flower' | 'Fruit' | 'Herb';

export type Exposure = 'Full sun' | 'Full sun to part shade' | 'Part shade';

export type Difficulty = 'Easy' | 'Standard' | 'Intermediate' | 'Advanced' | 'Expert';

// ---- PLANTING ACTION TYPES ----
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

// ---- CATALOG TYPES ----
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

// ---- USER SEED TYPES ----
export type UserSeedItem = CatalogSeedItem & {
  catalog_seed_id: string | null;
  custom_seed_id: string | null;
  notes: string | null;
};

// ---- FILTER TYPES ----
export type Filter = 'plantType' | 'starting' | 'exposure' | 'season' | 'month' | 'readyToHarvest' | 'difficulty';

export type SelectedFilters = Record<Filter, string[]>;

export type OpenFilters = Partial<Record<Filter, boolean>>;

export type UserFilterPreferences = {
  order: Filter[];
  openByDefault: Filter[];
};

// ---- CUSTOM SEED TYPES ----
export type AddCustomSeedPayload = {
  name: string;
  type: SeedType;
  category: string;
  beanType: 'Broad' | 'Bush' | 'Pole' | null;
  latin: string | null;
  difficulty: Difficulty | null;
  exposure: Exposure | null;
  maturesInDays: number | null;
  maturesUnderDays: number | null;
  description: string | null;
  timing: string | null;
  starting: string | null;
  growing: string | null;
  harvest: string | null;
  companionPlanting: string | null;
  image: string | null;
  // planting: Planting[] | null;
};

export type PreviewImage = {
  uri: string;
  mimeType: string | undefined;
  base64: string | null | undefined;
};

// ---- CONSTANTS ----
export const DIFFICULTY = ['Easy', 'Standard', 'Intermediate', 'Advanced', 'Expert'];

export const EXPOSURE = ['Full sun', 'Full sun to part shade', 'Part shade'];

export const DETAILS = ['Description', 'Timing', 'Starting', 'Growing', 'Harvest', 'Companion Planting'];

export const VEGETABLES = [
  'Bean',
  'Beet',
  'Broccoli',
  'Cabbage',
  'Carrot',
  'Cauliflower',
  'Corn',
  'Cucumber',
  'Eggplant',
  'Kale',
  'Lettuce',
  'Onion',
  'Pea',
  'Pepper',
  'Pumpkin',
  'Radish',
  'Spinach',
  'Squash',
  'Tomato',
];

export const FLOWERS = [
  'Agastache',
  'Alyssum',
  'Bellis',
  'Calendula',
  'California Poppy',
  'Columbine',
  'Cornflower',
  'Cosmos',
  'Echinacea',
  'Eucalyptus',
  'Foxglove',
  'Marigold',
  'Nasturtium',
  'Poppy',
  'Rudbeckia',
  'Snapdragon',
  'Sunflower',
  'Sweet Pea',
  'Viola',
  'Zinnia',
];

export const FRUITS = ['Melon', 'Strawberry'];

export const HERBS = [
  'Basil',
  'Bergamot',
  'Chamomile',
  'Chives',
  'Cilantro',
  'Dill',
  'Lavender',
  'Mint',
  'Oregano',
  'Parsley',
  'Rosemary',
  'Sage',
  'Savory',
  'Shiso',
  'Thyme',
];
