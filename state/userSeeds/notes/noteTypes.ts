// ---- CONTEXT: UserSeedsContext actions related to notes ----
export type NoteAction =
  | { type: 'ADD_NOTE'; payload: InsertNoteInput & { tempId: string } }
  | { type: 'UPDATE_NOTE'; payload: UserSeedNote }
  | { type: 'SYNC_NOTE_WITH_DB'; payload: UserSeedNote & { tempId: string } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'RESTORE_NOTE_TO_SEED'; payload: UserSeedNote };

export type InsertNoteInput = {
  userId: string;
  userSeedId: string;
  title: string | null;
  note: string | null;
};

// ---- USER SEED NOTE ----
export type UserSeedNote = {
  id: string;
  userId: string;
  userSeedId: string;
  title: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
};

// ---- NOTE SHEET TYPES ----
// User-defined input values
export type NoteDraft = {
  userSeedId: string;
  title: string | null;
  note: string | null;
};

export const NOTE_FIELDS = ['title', 'note'] as const;
export type NoteFields = (typeof NOTE_FIELDS)[number];
export type NoteErrors = Partial<Record<NoteFields, string>>;
