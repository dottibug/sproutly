import { View, Text } from 'react-native';

type UserSeedRemindersProps = {
  readonly activeTab: string;
};

export default function UserSeedReminders({ activeTab }: UserSeedRemindersProps) {
  return (
    <View style={{ display: activeTab === 'reminders' ? 'flex' : 'none' }}>
      <Text>User Seed Reminders</Text>
    </View>
  );
}
