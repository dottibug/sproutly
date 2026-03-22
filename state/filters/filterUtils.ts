import { SelectedFilters, UserFilterPreferences, OpenFilters, FILTERS, DEFAULT_OPEN, PlantTypeFilter } from './filterTypes';
import { UserSeed } from '../userSeeds/types/seedTypes';
import { BrowseSeed } from '../browseSeeds/browseTypes';
import { MONTH_MAP, PlantingAction } from '../userSeeds/types/seedInfoTypes';
import { fetchUserFilterPrefs, updateUserFilterPrefs } from './filterQueries';

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

// Fetch user filter preferences from the database
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
export function applyFilters(seeds: UserSeed[], selectedFilters: SelectedFilters) {
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

export function filterByStarting(seed: UserSeed, selected: string[]) {
  // Get the planting actions for the seed
  const seedActions = new Set(seed.planting.map((p) => p.action));
  // Check if the selected actions include any of the seed's planting actions
  return selected.some((s) => {
    const action = s.toLowerCase().replace(' ', '_') as PlantingAction;
    return seedActions.has(action);
  });
}

export function filterByMonth(seed: UserSeed, selected: string[]) {
  // Get the planting months for the seed (as array of numbers)
  const seedMonths = seed.planting.map((p) => p.months);
  // Check if the selected months include any of the seed's planting months
  return selected.some((s) => {
    const month = MONTH_MAP[s];
    return seedMonths.some((m) => m.includes(month));
  });
}

export function filterByReadyToHarvest(seed: UserSeed, selected: string[]) {
  const days = seed.maturesUnderDays;
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

export function filterBrowseSeeds(seeds: BrowseSeed[], selectedFilters: Set<PlantTypeFilter>): BrowseSeed[] {
  if (selectedFilters.size > 0) {
    const filterArray = Array.from(selectedFilters);

    const filters = filterArray.map((plantType) => {
      if (plantType === 'Veggie') return 'Vegetable';
      return plantType;
    });

    return seeds.filter((seed) => new Set(filters).has(seed.type));
  }
  return seeds; // No filters applied (return all seeds)
}

export function getNumberOfSelectedFilters(selectedFilters: SelectedFilters): number {
  return Object.values(selectedFilters).reduce((acc, curr) => acc + curr.length, 0);
}
