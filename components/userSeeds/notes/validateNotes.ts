import { NoteErrors, NoteDraft } from '../../../state/userSeeds/notes/noteTypes';

// validateNotes.ts: Validates the note input and returns either errors or a note draft ready for database insertion

type NoteInput = {
  title: string;
  note: string;
};

type ValidResult = {
  isValid: boolean;
  errors: NoteErrors | null;
  noteDraft: NoteDraft | null;
};

// Validate note input and return either errors or a note draft ready for database insertion
export function validateNote(input: NoteInput, userSeedId: string): ValidResult {
  const errors: NoteErrors = {};

  if (!isValid(errors)) return { isValid: false, errors: errors, noteDraft: null };

  if (!input.title && !input.note) {
    errors.title = 'Title or note is required';
    errors.note = 'Title or note is required';
    return { isValid: false, errors: errors, noteDraft: null };
  }

  const noteDraft = createNoteDraft(input, userSeedId);
  return {
    isValid: true,
    errors: null,
    noteDraft,
  };
}

// Check if the note has any errors
function isValid(errors: NoteErrors): boolean {
  return Object.keys(errors).length === 0;
}

// Create a draft note object with cleaned fields (ready for database insertion)
function createNoteDraft(note: NoteInput, userSeedId: string): NoteDraft {
  return {
    userSeedId,
    title: note.title?.trim(),
    note: note.note?.trim(),
  };
}
