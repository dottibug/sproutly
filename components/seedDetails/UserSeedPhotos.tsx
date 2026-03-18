import { View, Text } from 'react-native';

type UserSeedPhotosProps = {
  readonly activeTab: string;
};

export default function UserSeedPhotos({ activeTab }: UserSeedPhotosProps) {
  return (
    <View style={{ display: activeTab === 'photos' ? 'flex' : 'none' }}>
      <Text>User Seed Photos</Text>
    </View>
  );
}
