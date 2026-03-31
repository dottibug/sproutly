import { UserSeed } from '../../state/userSeeds/seeds/seedTypes';
import UserSeedCard from './UserSeedCard';
import { FlatList, View } from 'react-native';

// UserSeedList.tsx: Renders a list of seeds in the user's collection.

type UserSeedListProps = {
  readonly seeds: UserSeed[];
  readonly deleteIsOpenForId: string | null;
  readonly setDeleteIsOpenForId: (id: string | null) => void;
};

export default function UserSeedList({ seeds, deleteIsOpenForId, setDeleteIsOpenForId }: UserSeedListProps) {
  return (
    <FlatList
      data={seeds}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <UserSeedCard
          key={item.id}
          seed={item}
          showDeleteConfirmation={deleteIsOpenForId === item.id}
          onSetDeleteIsOpenForId={setDeleteIsOpenForId}
        />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 2, paddingBottom: 24 }}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
    />
  );
}
