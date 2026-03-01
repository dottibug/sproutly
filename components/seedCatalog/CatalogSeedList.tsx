import { Fragment } from 'react';
import type { SeedCatalogItem } from '../../lib/seedCatalog';
import CatalogSeedCard from './CatalogSeedCard';

type CatalogSeedListProps = {
  readonly seeds: SeedCatalogItem[];
};

export default function CatalogSeedList({ seeds }: CatalogSeedListProps) {
  return (
    <Fragment>
      {seeds.map((seed: SeedCatalogItem) => (
        <CatalogSeedCard key={seed.id} seed={seed} />
      ))}
    </Fragment>
  );
}
