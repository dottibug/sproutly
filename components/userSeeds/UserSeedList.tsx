import { Fragment } from 'react';
import { UserSeed } from '../../state/userSeeds/types/seedTypes';
import UserSeedCard from './UserSeedCard';

type UserSeedListProps = {
  readonly seeds: UserSeed[];
};

// List of seeds in the user's collection
export default function UserSeedList({ seeds }: UserSeedListProps) {
  return (
    <Fragment>
      {seeds.map((seed: UserSeed) => (
        <UserSeedCard key={seed.id} seed={seed} />
      ))}
    </Fragment>
  );
}
