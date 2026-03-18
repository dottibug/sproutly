import { View, Text } from 'react-native';
import { UserSeedTab } from '../../utils/types';

type UserSeedHistoryProps = {
  readonly activeTab: UserSeedTab;
};

// UserSeedHistory component displays the history of a single seed in the user's collection
export default function UserSeedHistory({ activeTab }: UserSeedHistoryProps) {
  return (
    <View style={{ display: activeTab === 'History' ? 'flex' : 'none' }}>
      <Text>User Seed History</Text>
    </View>
  );
}
