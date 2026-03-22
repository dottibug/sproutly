// ---- ACTIONS ----
export type NoteAction =
  | { type: 'ADD_NOTE'; payload: NotePayload }
  | { type: 'UPDATE_NOTE'; payload: UserSeedNote }
  | { type: 'SYNC_NOTE_WITH_DB'; payload: UserSeedNote & { tempId: string } }
  | { type: 'DELETE_NOTE'; payload: string };

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

// ---- BUILD NOTE INPUT ----
export type NotePayload = {
  userId: string;
  userSeedId: string;
  tempId: string;
  title: string | null;
  note: string;
};

// ---- DRAFT (what the user types in the modal) ----
export type AddNoteDraft = {
  userSeedId: string;
  title: string | null;
  note: string;
};
