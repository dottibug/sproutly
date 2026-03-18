import { View, Text } from 'react-native';
import { UserSeedTab } from '../../utils/types';

type UserSeedPhotosProps = {
  readonly activeTab: UserSeedTab;
};

// UserSeedPhotos component displays the photos of a single seed in the user's collection
export default function UserSeedPhotos({ activeTab }: UserSeedPhotosProps) {
  return (
    <View style={{ display: activeTab === 'Photos' ? 'flex' : 'none' }}>
      <Text>User Seed Photos</Text>
    </View>
  );
}
