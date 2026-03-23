// ---- ACTIONS ----
export type PhotoAction =
  | { type: 'ADD_PHOTO'; payload: UserSeedPhoto & { tempId: string } }
  | { type: 'SYNC_PHOTO_WITH_DB'; payload: UserSeedPhoto & { tempId: string } }
  | { type: 'DELETE_PHOTO'; payload: string }
  | { type: 'RESTORE_PHOTO_TO_SEED'; payload: UserSeedPhoto };

// ---- USER SEED PHOTO ----
// imageUrl is a signed URL (storage path is in DB)
export type UserSeedPhoto = {
  id: string;
  userId: string;
  userSeedId: string;
  imageUri: string;
  createdAt: string;
};

// ---- IMAGE PREVIEW ----
export type ImagePreview = {
  uri: string;
  mimeType: string | undefined;
  base64: string | null | undefined;
};

// ---- DRAFT (what the user types in the modal) ----
export type AddPhotoDraft = {
  userSeedId: string;
  preview?: ImagePreview | null;
};
