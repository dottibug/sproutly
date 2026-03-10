import { Fragment } from 'react';
import { CatalogSeedItem } from '../../lib/types';
import CatalogSeedCard from './CatalogSeedCard';

type CatalogSeedListProps = {
  readonly seeds: CatalogSeedItem[];
};

export default function CatalogSeedList({ seeds }: CatalogSeedListProps) {
  return (
    <Fragment>
      {seeds.map((seed: CatalogSeedItem) => (
        <CatalogSeedCard key={seed.id} seed={seed} />
      ))}
    </Fragment>
  );
}
