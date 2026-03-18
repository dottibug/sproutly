import { View, Text } from 'react-native';

type UserSeedHistoryProps = {
  readonly activeTab: string;
};

export default function UserSeedHistory({ activeTab }: UserSeedHistoryProps) {
  return (
    <View style={{ display: activeTab === 'history' ? 'flex' : 'none' }}>
      <Text>User Seed History</Text>
    </View>
  );
}
