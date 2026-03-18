import { View, Text } from 'react-native';
import { UserSeedTab } from '../../utils/types';

type UserSeedRemindersProps = {
  readonly activeTab: UserSeedTab;
};

// UserSeedReminders component displays the reminders of a single seed in the user's collection
export default function UserSeedReminders({ activeTab }: UserSeedRemindersProps) {
  return (
    <View style={{ display: activeTab === 'Reminders' ? 'flex' : 'none' }}>
      <Text>User Seed Reminders</Text>
    </View>
  );
}
