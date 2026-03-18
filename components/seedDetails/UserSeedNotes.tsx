import { View, Text } from 'react-native';

type UserSeedNotesProps = {
  readonly activeTab: string;
};

export default function UserSeedNotes({ activeTab }: UserSeedNotesProps) {
  return (
    <View style={{ display: activeTab === 'notes' ? 'flex' : 'none' }}>
      <Text>User Seed Notes</Text>
    </View>
  );
}
