import { Fragment } from 'react';
import { BrowseSeed } from '../../state/browseSeeds/browseTypes';
import BrowseSeedCard from './BrowseSeedCard';

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
