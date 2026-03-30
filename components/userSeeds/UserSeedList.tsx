import { Fragment } from 'react';
import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import UserSeedCard from './UserSeedCard';

// UserSeedList.tsx: Renders a list of seeds in the user's collection.

type UserSeedListProps = {
  readonly seeds: UserSeed[];
  readonly deleteIsOpenForId: string | null;
  readonly setDeleteIsOpenForId: (id: string | null) => void;
};

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
