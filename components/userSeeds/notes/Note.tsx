import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { UserSeedNote } from '../../../state/userSeeds/types/noteTypes';
import { colors } from '../../../styles/theme';
import Heading from '../../ui/Heading';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useUserSeed } from '../../../state/userSeeds/UserSeedsContext';
import { useState } from 'react';
import EditNoteModal from '../EditNoteModal';

// TODO: Use a modal for delete confirmation instead of Alert?

type NoteProps = {
  readonly note: UserSeedNote;
};

export default function Note({ note }: NoteProps) {
  const { deleteNote } = useUserSeed();
  const [editing, setEditing] = useState(false);

  const handleEditNote = () => setEditing(true);

  const handleDeleteNote = () => {
    Alert.alert('Delete note?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteNote(note.id) },
    ]);
  };

  return (
    <View style={styles.noteContainer}>
      <Heading size="small" color="secondary">
        {note.title}
      </Heading>
      <Text style={styles.noteText}>{note.note}</Text>
      <View style={styles.noteIcons}>
        <Pressable onPress={handleEditNote}>
          <MaterialIcons name="mode-edit" size={24} color={colors.gray} />
        </Pressable>
        <Pressable onPress={handleDeleteNote}>
          <MaterialCommunityIcons name="trash-can" size={24} color={colors.gray} />
        </Pressable>
      </View>

      {editing && <EditNoteModal visible={editing} onRequestClose={() => setEditing(false)} note={note} />}
    </View>
  );
}

const styles = StyleSheet.create({
  noteContainer: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.gray,
    gap: 8,
  },
  noteText: {
    fontSize: 16,
    lineHeight: 20,
  },
  noteIcons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
});
