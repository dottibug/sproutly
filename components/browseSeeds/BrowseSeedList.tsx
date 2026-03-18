import { Fragment } from 'react';
import { BrowseSeedItem } from '../../utils/types';
import BrowseSeedCard from './BrowseSeedCard';

type BrowseSeedListProps = {
  readonly seeds: BrowseSeedItem[];
};

export default function BrowseSeedList({ seeds }: BrowseSeedListProps) {
  return (
    <Fragment>
      {seeds.map((seed: BrowseSeedItem) => (
        <BrowseSeedCard key={seed.id} seed={seed} />
      ))}
    </Fragment>
  );
}
