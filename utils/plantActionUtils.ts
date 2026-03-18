import { PlantingActionRow, Planting } from './types';

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
