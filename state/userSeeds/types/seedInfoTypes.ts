// ---- TYPES ----
export type SeedType = 'Vegetable' | 'Flower' | 'Fruit' | 'Herb';
export type BeanType = 'Broad' | 'Bush' | 'Pole' | null;
export type Difficulty = 'Easy' | 'Standard' | 'Intermediate' | 'Advanced' | 'Expert';
export type Exposure = 'Full sun' | 'Full sun to part shade' | 'Part shade';

// ---- PLANTING INFO ----
export type PlantingAction = 'start_indoors' | 'direct_sow' | 'transplant';
export type BeanVariantForPlanting = 'broad' | 'bush_pole' | null;

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

// ---- CONSTANTS ----
export const PLANT_TYPES: SeedType[] = ['Vegetable', 'Flower', 'Fruit', 'Herb'];
export const STARTING = ['Start indoors', 'Direct sow'];
export const EXPOSURE = ['Full sun', 'Full sun to part shade', 'Part shade'];
export const SEASON = ['Winter', 'Spring', 'Summer', 'Fall'];
export const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const READY_TO_HARVEST = ['Under 50 days', '50 to 70 days', '80 to 100 days', '110 to 130 days', 'Over 130 days'];
export const DIFFICULTY = ['Easy', 'Standard', 'Intermediate', 'Advanced', 'Expert'];

export const MONTH_MAP: Record<string, number> = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
};

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
