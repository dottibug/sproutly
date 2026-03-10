import { Fragment } from 'react';
import { UserSeedItem } from '../../lib/types';
import UserSeedCard from './UserSeedCard';

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
