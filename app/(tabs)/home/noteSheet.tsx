import { View, Alert, ScrollView, StyleSheet } from 'react-native';
import { useState, useMemo, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useNote, useUserSeed } from '../../../state/barrels/contextBarrel';
import { UserSeedNote, NoteErrors } from '../../../state/userSeeds/notes/noteTypes';
import { getNoteSheetTitle } from '../../../state/userSeeds/notes/noteUtils';
import { validateNote } from '../../../components/userSeeds/notes/validateNotes';
import { Heading, Input, AppButton, ScreenOptions } from '../../../components/uiComponentBarrel';

// NoteSheet.tsx: Renders the note sheet for a user seed. Users can add a new note or edit an existing note. NoteContext.tsx manages the form state.

type NoteSheetParams = {
  userSeedId: string;
  noteId?: string;
  variety: string;
  plant: string;
};

export default function NoteSheet() {
  const router = useRouter();
  const params = useLocalSearchParams<NoteSheetParams>();
  const { userSeedId, noteId, variety, plant } = params;
  const { seeds, addNote, updateNote } = useUserSeed();
  const seed = seeds.find((s) => s.id === userSeedId);
  const isUpdate = noteId !== null && noteId !== undefined && noteId !== '';

  const noteToUpdate: UserSeedNote | undefined = isUpdate ? seed?.notes.find((n) => n.id === noteId) : undefined;

  // State of the note form
  const { note, setTitle, setNote, resetNote } = useNote();
  const [errors, setErrors] = useState<NoteErrors | null>(null);

  const sheetTitle = useMemo(() => getNoteSheetTitle(isUpdate, variety, plant), [isUpdate, variety, plant]);

  // Set default values for the note form. Runs on mount and when editing the note.
  useEffect(() => {
    // Pre-fill fields when editing the note
    if (isUpdate) {
      if (!noteToUpdate) return;
      setTitle(noteToUpdate.title || '');
      setNote(noteToUpdate.note || '');
      return;
    }
    resetNote(); // Clear fields when creating a new note
  }, [isUpdate, noteToUpdate, resetNote, setTitle, setNote]);

  const onSaveNote = async () => {
    const { isValid, errors, noteDraft } = validateNote(
      {
        title: note.title || '',
        note: note.note || '',
      },
      userSeedId,
    );

    // Creating a new note
    if (!isUpdate) {
      if (!isValid) {
        setErrors(errors);
        return;
      }
      if (noteDraft)
        addNote(noteDraft).catch((error) =>
          Alert.alert('Could not add note', 'Please try again.', [
            { text: 'OK', onPress: () => console.error('Error adding note:', error) },
          ]),
        );
    }

    // Updating an existing note
    if (isUpdate) {
      if (!noteToUpdate) return;
      if (!isValid) {
        setErrors(errors);
        return;
      }
      if (noteDraft)
        updateNote(noteToUpdate, noteDraft).catch((error) =>
          Alert.alert('Could not save changes', 'Please try again.', [
            { text: 'OK', onPress: () => console.error('Error updating note:', error) },
          ]),
        );
    }
    resetNote();
    router.back();
  };

  return (
    <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
      <ScreenOptions backButtonMode="generic" />
      <View style={styles.contentContainer}>
        <Heading size="small" customStyles={styles.sheetTitle}>
          {sheetTitle}
        </Heading>
        <View style={styles.inputs}>
          <View style={styles.inputSection}>
            <Input
              label="Title"
              headingSize="xsmall"
              placeholder="Enter note title"
              value={note.title || ''}
              onChangeText={setTitle}
              hasError={Boolean(errors?.title)}
              errorMessage={errors?.title}
            />
          </View>
          <View style={styles.inputSection}>
            <Input
              label="Note"
              value={note.note || ''}
              onChangeText={setNote}
              headingSize="xsmall"
              placeholder="Write your note here..."
              hasError={Boolean(errors?.note)}
              errorMessage={errors?.note}
              multiline
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <AppButton text={isUpdate ? 'Save Changes' : 'Save Note'} size="small" rounded onPress={onSaveNote} />
        </View>
      </View>
    </ScrollView>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentContainer: {
    gap: 18,
    marginTop: 32,
    paddingHorizontal: 16,
  },
  inputs: {
    gap: 18,
    marginTop: 16,
  },
  inputSection: {
    gap: 8,
    marginTop: 2,
  },
  buttonContainer: {
    marginVertical: 16,
  },
  sheetTitle: {
    fontSize: 17,
    textAlign: 'center',
  },
});
