import { UserSeed } from '../userSeeds/seeds/seedTypes';
import { BrowseSeed } from '../browseSeeds/browseTypes';
import { MONTH, Planting } from '../userSeeds/seeds/seedInfoTypes';
import { getTimestamp } from './dateUtils';

//appUtils.ts: Contains utility functions for the app

// ---- TEMP ID ----
export function createTempId() {
  const now = getTimestamp();
  return `temp-${now}`;
}

// ---- SEARCH UTILS ----
export function searchSeeds(seeds: UserSeed[] | BrowseSeed[], searchQuery: string): UserSeed[] | BrowseSeed[] {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return seeds;

  const terms = query.split(' ').filter(Boolean);

  return seeds.filter((seed) => {
    const searchablePlantingInfo = searchPlantingInfo(seed.planting);

    const searchableFields = [
      seed.variety,
      seed.plant,
      seed.category,
      seed.sku,
      seed.latin,
      seed.exposure,
      seed.difficulty,
      searchablePlantingInfo,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return terms.every((term) => searchableFields.includes(term));
  });
}

function searchPlantingInfo(planting: Planting[]): string {
  // If no planting info, return empty array
  if (!planting?.length) return '';

  const searchableTerms = new Set<string>();

  // Get any months and seasons from the seed's planting info
  for (const p of planting) {
    // Add any seasons to the set
    if (p.seasons?.length) for (const season of p.seasons) searchableTerms.add(season);

    // Add any months to the set
    if (p.months?.length) {
      for (const month of p.months) {
        searchableTerms.add(FULL_MONTHS[month - 1]);
      }
    }
  }
  return Array.from(searchableTerms).join(' ').toLowerCase();
}

// Used to convert month numbers to full month names (ex. 5 (May) is accessed by FULL_MONTHS[5 - 1] = 'may')
const FULL_MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
];
