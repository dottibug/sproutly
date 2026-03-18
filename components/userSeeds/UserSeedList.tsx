import { Fragment } from 'react';
import { UserSeedItem } from '../../utils/types';
import UserSeedCard from './UserSeedCard';

type UserSeedListProps = {
  readonly seeds: UserSeedItem[];
};

// List of seeds in the user's collection
export default function UserSeedList({ seeds }: UserSeedListProps) {
  return (
    <Fragment>
      {seeds.map((seed: UserSeedItem) => (
        <UserSeedCard key={seed.id} seed={seed} />
      ))}
    </Fragment>
  );
}
