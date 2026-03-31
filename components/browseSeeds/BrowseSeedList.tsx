import { BrowseSeed } from '../../state/browseSeeds/browseTypes';
import BrowseSeedCard from './BrowseSeedCard';
import { FlatList, View } from 'react-native';

// BrowseSeedList.tsx: Maps the seeds from the database catalog to BrowseSeedCard components.

type BrowseSeedListProps = {
  readonly seeds: BrowseSeed[];
};

export default function BrowseSeedList({ seeds }: BrowseSeedListProps) {
  return (
    <FlatList
      data={seeds}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <BrowseSeedCard key={item.id} seed={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 2, paddingBottom: 24 }}
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
    />
  );
}
