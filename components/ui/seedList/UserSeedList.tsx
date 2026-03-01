import type { UserSeedItem } from '../../../lib/seedCatalog';
import UserSeedCard from '../../userSeeds/UserSeedCard';
import { Fragment } from 'react';

type UserSeedListProps = {
  readonly seeds: UserSeedItem[];
};

export default function UserSeedList({ seeds }: UserSeedListProps) {
  return (
    <Fragment>
      {seeds.map((seed: UserSeedItem) => (
        <UserSeedCard key={seed.id} seed={seed} />
      ))}
    </Fragment>
  );
}
