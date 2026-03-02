import type { UserSeedItem, CatalogSeedItem } from '../seedCatalog';

export function createUserSeedFromDatabase(row: any): UserSeedItem {
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
  };
  return newSeed;
}

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
    notes: null,
  };

  return newSeed;
}

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
    notes: null,
  };

  return newSeed;
}
