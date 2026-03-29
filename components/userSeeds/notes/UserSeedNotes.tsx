import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';
import { UserSeedTab, UserSeed, UserSeedNote } from '../../../state/barrels/typesBarrel';
import Note from './Note';
import FABButton from '../../ui/buttons/FabButton';
import { colors } from '../../../styles/theme';

type UserSeedNotesProps = {
  readonly activeTab: UserSeedTab;
  readonly seed: UserSeed;
};

// UserSeedNotes.tsx: Renders the notes screen for a user seed. Shows notes for a seed. Users can add, edit, and delete notes.
export default function UserSeedNotes({ seed, activeTab }: UserSeedNotesProps) {
  const router = useRouter();
  const { deleteNote } = useUserSeed();

  const notes = seed.notes ?? ([] as UserSeedNote[]);
  const hasNotes = notes.length > 0;

  // Calculate padding bottom for the FAB button
  const insets = useSafeAreaInsets();
  const paddingBottom = FAB_MARGIN * 2 + FAB_HEIGHT;

  // Navigate to the note sheet to add a new note
  const handleNewNote = () => {
    router.push({
      pathname: '/home/noteSheet',
      params: {
        userSeedId: seed.id,
        variety: seed.variety,
        plant: seed.plant,
      },
    });
  };

  // Navigate to the note sheet to edit an existing note
  const handleEditNote = (note: UserSeedNote) => {
    router.push({
      pathname: '/home/noteSheet',
      params: {
        userSeedId: seed.id,
        noteId: note.id,
        variety: seed.variety,
        plant: seed.plant,
      },
    });
  };

  const handleDeleteNote = (note: UserSeedNote) => void deleteNote(note);

  // Shows alert to confirm deleting a note
  const showDeleteAlert = (note: UserSeedNote) => {
    Alert.alert('Delete note?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => handleDeleteNote(note) },
    ]);
  };

  return (
    <View style={[styles.screen, { display: activeTab === 'Notes' ? 'flex' : 'none' }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: paddingBottom }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {!hasNotes && <Text style={styles.empty}>{NO_NOTES}</Text>}
          {hasNotes && (
            <View style={styles.notes}>
              {notes.map((note) => (
                <Note key={note.id} note={note} onEdit={handleEditNote} onDelete={showDeleteAlert} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <FABButton iconName="sticky-note" iconSize={24} accessibilityLabel="Add note" bottomInset={insets.bottom} onPress={handleNewNote} />
    </View>
  );
}

const NO_NOTES = 'No notes found. Add a note to get started.';
const FAB_MARGIN = 16;
const FAB_HEIGHT = 56;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: 'relative',
  },
  scroll: {
    flex: 1,
  },
  content: {
    flex: 1,
    marginTop: 24,
    paddingHorizontal: 16,
  },
  notes: {
    gap: 18,
    marginBottom: 10,
  },
  empty: {
    marginVertical: 16,
    textAlign: 'center',
  },
  emptyText: {
    color: colors.secondary,
    fontStyle: 'italic',
    marginVertical: 8,
  },
});
