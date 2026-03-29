import { Fragment } from 'react';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import UserSeedCard from './UserSeedCard';

type UserSeedListProps = {
  readonly seeds: UserSeed[];
  readonly deleteIsOpenForId: string | null;
  readonly setDeleteIsOpenForId: (id: string | null) => void;
};

// List of seeds in the user's collection
export default function UserSeedList({ seeds, deleteIsOpenForId, setDeleteIsOpenForId }: UserSeedListProps) {
  return (
    <Fragment>
      {seeds.map((seed: UserSeed) => (
        <UserSeedCard
          key={seed.id}
          seed={seed}
          showDeleteConfirmation={deleteIsOpenForId === seed.id}
          onSetDeleteIsOpenForId={setDeleteIsOpenForId}
        />
      ))}
    </Fragment>
  );
}
