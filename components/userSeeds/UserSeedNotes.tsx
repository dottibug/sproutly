import { View, Text } from 'react-native';
import { UserSeedTab } from '../../utils/types';

type UserSeedNotesProps = {
  readonly activeTab: UserSeedTab;
};

// UserSeedNotes component displays the notes of a single seed in the user's collection
export default function UserSeedNotes({ activeTab }: UserSeedNotesProps) {
  return (
    <View style={{ display: activeTab === 'Notes' ? 'flex' : 'none' }}>
      <Text>User Seed Notes</Text>
    </View>
  );
}
