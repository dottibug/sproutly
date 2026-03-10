import { SelectedFilters, UserFilterPreferences, OpenFilters, Filter, UserSeedItem, PlantingAction, SeedType } from '../types';
import { fetchUserFilterPrefs, updateUserFilterPrefs } from '../queries';

export const FILTERS: Filter[] = ['plantType', 'starting', 'exposure', 'season', 'month', 'readyToHarvest', 'difficulty'];

export const DEFAULT_OPEN: Filter[] = ['plantType', 'starting'];

/* Determine which filter sections are expanded when the 'Filters' accordion is opened
 - expand sections that have at least one filter selected
 - expand sections that are in FilterPreferences.expandedByDefault
 */
export function getOpenFilters(selected: SelectedFilters, preferences: UserFilterPreferences): OpenFilters {
  const open: OpenFilters = {};
  for (const filter of FILTERS) {
    open[filter] = selected[filter].length > 0 || preferences.openByDefault.includes(filter);
  }
  return open;
}

export async function getUserFilterPreferences(profileId: string): Promise<UserFilterPreferences> {
  if (!profileId) return { order: FILTERS, openByDefault: DEFAULT_OPEN };
  const userFilterPrefs = await fetchUserFilterPrefs(profileId);
  return userFilterPrefs;
}

export async function updateUserFilterPreferences(profileId: string, preferences: UserFilterPreferences): Promise<UserFilterPreferences> {
  if (!profileId) return { order: FILTERS, openByDefault: DEFAULT_OPEN } as UserFilterPreferences;
  const userFilterPrefs = await updateUserFilterPrefs(profileId, preferences);
  return userFilterPrefs;
}

// Apply filters to a list of seeds
export function applyFilters(seeds: UserSeedItem[], selectedFilters: SelectedFilters) {
  let list = seeds;

  for (const filter of FILTERS) {
    const selected = selectedFilters[filter];
    if (selected.length === 0) continue; // No filters selected in this section

    list = list.filter((seed) => {
      switch (filter) {
        case 'plantType':
          return selected.includes(seed.type);
        case 'starting':
          return filterByStarting(seed, selected);
        case 'exposure':
          return seed?.exposure && selected.includes(seed.exposure);
        case 'difficulty':
          return seed?.difficulty && selected.includes(seed.difficulty);
        case 'season':
          return seed.planting.some((p) => p.seasons.some((s) => selected.includes(s)));
        case 'month':
          return filterByMonth(seed, selected);
        case 'readyToHarvest':
          return filterByReadyToHarvest(seed, selected);
        default:
          return true;
      }
    });
  }
  return list;
}

export function filterByStarting(seed: UserSeedItem, selected: string[]) {
  // Get the planting actions for the seed
  const seedActions = new Set(seed.planting.map((p) => p.action));
  // Check if the selected actions include any of the seed's planting actions
  return selected.some((s) => {
    const action = s.toLowerCase().replace(' ', '_') as PlantingAction;
    return seedActions.has(action);
  });
}

export function filterByMonth(seed: UserSeedItem, selected: string[]) {
  // Get the planting months for the seed (as array of numbers)
  const seedMonths = seed.planting.map((p) => p.months);
  // Check if the selected months include any of the seed's planting months
  return selected.some((s) => {
    const month = MONTH_MAP[s];
    return seedMonths.some((m) => m.includes(month));
  });
}

export function filterByReadyToHarvest(seed: UserSeedItem, selected: string[]) {
  const days = seed.matures_under_days;
  if (days === null) return false;
  return selected.some((s) => {
    const readyToHarvestLabel = String(s);
    if (readyToHarvestLabel === 'Under 50 days') return days < 50;
    if (readyToHarvestLabel === '50 to 70 days') return days >= 50 && days <= 70;
    if (readyToHarvestLabel === '80 to 100 days') return days >= 80 && days <= 100;
    if (readyToHarvestLabel === '110 to 130 days') return days >= 110 && days <= 130;
    if (readyToHarvestLabel === 'Over 130 days') return days > 130;
    return false;
  });
}

// ---- CONSTANTS ----
export const PLANT_TYPES: SeedType[] = ['Vegetable', 'Flower', 'Fruit', 'Herb'];
export const STARTING = ['Start indoors', 'Direct sow'];
export const EXPOSURE = ['Full sun', 'Full sun to part shade', 'Part shade'];
export const SEASON = ['Winter', 'Spring', 'Summer', 'Fall'];
export const MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const READY_TO_HARVEST = ['Under 50 days', '50 to 70 days', '80 to 100 days', '110 to 130 days', 'Over 130 days'];
export const DIFFICULTY = ['Easy', 'Standard', 'Intermediate', 'Advanced', 'Expert'];

export const FILTER_MAP: Record<Filter, string> = {
  plantType: 'Plant Type',
  starting: 'Starting',
  exposure: 'Exposure',
  season: 'Season',
  month: 'Month',
  readyToHarvest: 'Ready to Harvest',
  difficulty: 'Difficulty',
};

export const FILTER_OPTIONS: Record<Filter, string[]> = {
  plantType: PLANT_TYPES,
  starting: STARTING,
  exposure: EXPOSURE,
  season: SEASON,
  month: MONTH,
  readyToHarvest: READY_TO_HARVEST,
  difficulty: DIFFICULTY,
};

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
