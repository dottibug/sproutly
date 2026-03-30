import { Fragment } from 'react';
import { BrowseSeed } from '../../state/browseSeeds/browseTypes';
import BrowseSeedCard from './BrowseSeedCard';

// BrowseSeedList.tsx: Maps the seeds from the database catalog to BrowseSeedCard components.

type BrowseSeedListProps = {
  readonly seeds: BrowseSeed[];
};

export default function BrowseSeedList({ seeds }: BrowseSeedListProps) {
  return (
    <Fragment>
      {seeds.map((seed: BrowseSeed) => (
        <BrowseSeedCard key={seed.id} seed={seed} />
      ))}
    </Fragment>
  );
}
