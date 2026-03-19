import { createContext, useReducer, useCallback, useMemo, useEffect, useContext } from 'react';
import { useAuth, Profile } from './AuthContext';
import { UserSeedItem, BrowseSeedItem, PreviewImage, CustomSeedPayload, UserSeedNote, UserSeedPhoto } from '../utils/types';
import { getUserSeedCollection, createUserSeedFromCatalog, isDuplicateSeed } from '../utils/userSeedUtils';
import { pickImage, uploadImage, getSignedSeedImageUrl, deleteSeedImage } from '../utils/userSeedImageUtils';
import {
  addCatalogSeedToUserCollection,
  deleteByCatalogId,
  deleteByCustomId,
  insertCustomSeed,
  insertUserSeedNote,
  updateUserSeedNote,
  deleteUserSeedNote,
  insertUserSeedPhoto,
  deleteUserSeedPhoto,
} from '../utils/queries';

// TODO: Handle errors
// TODO: Refactor, with helper functions for optimistic updates

// UserSeedsContext.tsx follows the React context & reducer pattern to manage state for the user's seeds.
// Prefer this pattern to avoid deep prop drilling in React components.
// https://react.dev/learn/scaling-up-with-reducer-and-context

// ---- TYPES ----
type UserSeedsAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: UserSeedItem[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'ADD_SEED_FROM_CATALOG'; payload: BrowseSeedItem }
  | { type: 'ADD_CUSTOM_SEED'; payload: UserSeedItem }
  | { type: 'DELETE_SEED_BY_CATALOG_ID'; payload: UserSeedItem['catalog_seed_id'] }
  | { type: 'DELETE_SEED_BY_CUSTOM_ID'; payload: UserSeedItem['custom_seed_id'] }
  | { type: 'ADD_NOTE_TO_SEED'; payload: { collectionId: string; userId: string; note: string; title: string | null; tempId: string } }
  | { type: 'REPLACE_NOTE_IN_SEED'; payload: { collectionId: string; tempId: string; note: UserSeedNote } }
  | { type: 'UPDATE_NOTE_IN_SEED'; payload: { noteId: string; title: string | null; note: string } }
  | { type: 'DELETE_NOTE_FROM_SEED'; payload: { noteId: string } }
  | { type: 'ADD_PHOTO_TO_SEED'; payload: { collectionId: string; photo: UserSeedPhoto } }
  | { type: 'REPLACE_PHOTO_IN_SEED'; payload: { collectionId: string; tempId: string; photo: UserSeedPhoto } }
  | { type: 'DELETE_PHOTO_FROM_SEED'; payload: { photoId: string } }
  | { type: 'RESTORE_PHOTO_TO_SEED'; payload: { collectionId: string; photo: UserSeedPhoto } };

// ---- INITIAL STATE SETUP ----
type UserSeedsState = {
  seeds: UserSeedItem[];
  loading: boolean;
  error: string | null;
};

const initialState: UserSeedsState = {
  seeds: [],
  loading: false,
  error: null,
};

// ---- REDUCER ----
function userSeedsReducer(state: UserSeedsState, action: UserSeedsAction): UserSeedsState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_SUCCESS':
      return { ...state, seeds: action.payload, loading: false, error: null };
    case 'LOAD_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_SEED_FROM_CATALOG':
      return { ...state, seeds: [...state.seeds, createUserSeedFromCatalog(action.payload)] };
    case 'ADD_CUSTOM_SEED':
      return { ...state, seeds: [...state.seeds, action.payload] };
    case 'DELETE_SEED_BY_CATALOG_ID':
      return { ...state, seeds: state.seeds.filter((s) => s.catalog_seed_id !== action.payload) };
    case 'DELETE_SEED_BY_CUSTOM_ID':
      return { ...state, seeds: state.seeds.filter((s) => s.custom_seed_id !== action.payload) };
    case 'ADD_NOTE_TO_SEED':
      return {
        ...state,
        seeds: state.seeds.map((s: UserSeedItem) => {
          if (s.id !== action.payload.collectionId) return s;

          const currentNotes = s.notes ?? [];
          const now = new Date().toISOString();

          const newNote: UserSeedNote = {
            id: action.payload.tempId,
            userCollectionId: action.payload.collectionId,
            userId: action.payload.userId,
            title: action.payload.title,
            note: action.payload.note,
            createdAt: now,
            updatedAt: now,
          };

          return { ...s, notes: [...currentNotes, newNote] };
        }),
      };
    case 'UPDATE_NOTE_IN_SEED':
      return {
        ...state,
        seeds: state.seeds.map((s: UserSeedItem) => ({
          ...s,
          notes: s.notes?.map((n) => {
            if (n.id !== action.payload.noteId) return n;
            const now = new Date().toISOString();
            return {
              ...n,
              title: action.payload.title,
              note: action.payload.note,
              updatedAt: now,
            };
          }),
        })),
      };
    case 'REPLACE_NOTE_IN_SEED':
      return {
        ...state,
        seeds: state.seeds.map((s: UserSeedItem) => {
          if (s.id !== action.payload.collectionId) return s;

          return {
            ...s,
            notes: s.notes?.map((n) => (n.id === action.payload.tempId ? action.payload.note : n)),
          };
        }),
      };
    case 'DELETE_NOTE_FROM_SEED':
      return {
        ...state,
        seeds: state.seeds.map((s: UserSeedItem) => ({
          ...s,
          notes: s.notes?.filter((n) => n.id !== action.payload.noteId),
        })),
      };
    case 'ADD_PHOTO_TO_SEED':
      return {
        ...state,
        seeds: state.seeds.map((s) => {
          if (s.id !== action.payload.collectionId) return s;
          const currentPhotos = s.photos ?? [];
          return { ...s, photos: [action.payload.photo, ...currentPhotos] };
        }),
      };

    case 'REPLACE_PHOTO_IN_SEED':
      return {
        ...state,
        seeds: state.seeds.map((s) => {
          if (s.id !== action.payload.collectionId) return s;
          return {
            ...s,
            photos: (s.photos ?? []).map((p) => (p.id === action.payload.tempId ? action.payload.photo : p)),
          };
        }),
      };

    case 'DELETE_PHOTO_FROM_SEED':
      return {
        ...state,
        seeds: state.seeds.map((s) => ({
          ...s,
          photos: (s.photos ?? []).filter((p) => p.id !== action.payload.photoId),
        })),
      };

    case 'RESTORE_PHOTO_TO_SEED':
      return {
        ...state,
        seeds: state.seeds.map((s) => {
          if (s.id !== action.payload.collectionId) return s;
          const currentPhotos = s.photos ?? [];
          return { ...s, photos: [action.payload.photo, ...currentPhotos] };
        }),
      };
    default:
      return state;
  }
}

// ---- CONTEXT SETUP ----
type UserSeedsContextValue = {
  seeds: UserSeedItem[];
  loading: boolean;
  error: string | null;
  addSeedFromCatalog: (seed: BrowseSeedItem) => Promise<void>;
  addCustomSeed: (preview: PreviewImage, payload: CustomSeedPayload) => Promise<void>;
  // addCustomSeed: (seed: UserSeedItem) => void;
  deleteSeedByCatalogId: (seed: UserSeedItem) => Promise<void>;
  deleteSeedByCustomId: (seed: UserSeedItem) => Promise<void>;
  addNoteToSeed: (collectionId: string, title: string | null, note: string) => Promise<void>;
  updateNoteInSeed: (noteId: string, title: string | null, note: string) => Promise<void>;
  deleteNoteFromSeed: (noteId: string) => Promise<void>;
  addPhotoToSeed: (collectionId: string) => Promise<void>;
  deletePhotoFromSeed: (photoId: string, imagePathOrUrl: string) => Promise<void>;
};

const UserSeedsContext = createContext<UserSeedsContextValue | null>(null);

// ---- PROVIDER (passes context to children) ----
type UserSeedsProviderProps = {
  readonly children: React.ReactNode;
};

export function UserSeedsProvider({ children }: UserSeedsProviderProps) {
  const [state, dispatch] = useReducer(userSeedsReducer, initialState);
  const { profile } = useAuth();

  const loadUserSeeds = useCallback(async () => {
    dispatch({ type: 'LOAD_START' });
    try {
      const collection = await getUserSeedCollection(profile as Profile);
      dispatch({ type: 'LOAD_SUCCESS', payload: collection ?? [] });
    } catch (error) {
      dispatch({ type: 'LOAD_ERROR', payload: error instanceof Error ? error.message : 'Failed to load user seed collection' });
    }
  }, [profile?.id]);

  // Load user seeds when component mounts and there is a profile
  useEffect(() => {
    // No profile means no user seeds to load
    if (!profile?.id) return;
    loadUserSeeds();
  }, [profile?.id, loadUserSeeds]);

  const addSeedFromCatalog = useCallback(
    async (browseSeed: BrowseSeedItem) => {
      if (!profile?.id) return;
      if (isDuplicateSeed(state.seeds, browseSeed.id)) return;

      // Add seed optimistically (doesn't block UI)
      dispatch({ type: 'ADD_SEED_FROM_CATALOG', payload: browseSeed });

      try {
        const newSeed = await addCatalogSeedToUserCollection(profile.id, browseSeed.id);
        console.log('✅ Seed added to collection from catalog:', newSeed);
      } catch (error) {
        dispatch({ type: 'DELETE_SEED_BY_CATALOG_ID', payload: browseSeed.id });
        console.error('Error adding seed to collection:', error instanceof Error ? error.message : 'Unknown error');
      }
    },
    [profile?.id, state.seeds],
  );

  const addCustomSeed = useCallback(
    async (preview: PreviewImage | null, payload: CustomSeedPayload) => {
      if (!profile?.id) return;

      // Upload preview image to storage bucket
      const imagePath = preview ? await uploadImage(profile.id, preview.mimeType, preview.base64) : null;

      // Insert custom seed into database (custom_seeds and user_seed_collection tables)
      const payloadWithImagePath = imagePath ? { ...payload, image: imagePath } : payload;
      const newCustomSeed = await insertCustomSeed(profile.id, payloadWithImagePath);

      // Get signed URL for the imagePath
      const imageIsPath = newCustomSeed.image && !newCustomSeed.image.startsWith('http');
      const signedUrl = imageIsPath ? await getSignedSeedImageUrl(newCustomSeed.image) : null;
      const customSeedWithSignedImage = signedUrl ? { ...newCustomSeed, image: signedUrl } : newCustomSeed;

      // Add custom seed to state
      dispatch({ type: 'ADD_CUSTOM_SEED', payload: customSeedWithSignedImage });
    },
    [profile?.id],
  );

  const deleteSeedByCatalogId = useCallback(
    async (seed: UserSeedItem) => {
      if (!profile?.id) return;

      // Remove seed optimistically
      dispatch({ type: 'DELETE_SEED_BY_CATALOG_ID', payload: seed.catalog_seed_id });

      try {
        await deleteByCatalogId(profile.id, seed.catalog_seed_id as string);
        console.log('✅ Seed removed from collection by catalog ID:');
      } catch (error) {
        dispatch({ type: 'ADD_SEED_FROM_CATALOG', payload: seed });
        console.error('Error removing seed from collection:', error instanceof Error ? error.message : 'Unknown error');
      }
    },
    [profile?.id, state.seeds],
  );

  const deleteSeedByCustomId = useCallback(
    async (seed: UserSeedItem) => {
      if (!profile?.id) return;

      // Remove seed optimistically
      dispatch({ type: 'DELETE_SEED_BY_CUSTOM_ID', payload: seed.custom_seed_id });

      // Update database
      try {
        await deleteByCustomId(seed.custom_seed_id as string);
        console.log('✅ Seed removed from collection by custom ID:');
      } catch (error) {
        dispatch({ type: 'ADD_CUSTOM_SEED', payload: seed });
        console.error('Error removing seed from collection:', error instanceof Error ? error.message : 'Unknown error');
      }
    },
    [profile?.id, state.seeds],
  );

  const addNoteToSeed = useCallback(
    async (collectionId: string, title: string | null, note: string) => {
      if (!profile?.id) return;

      const titleTrim = title?.trim() ?? null;
      const noteTrim = note.trim();
      if (!noteTrim) return;

      // Optimistically add note to state
      const now = new Date().toISOString();
      const tempId = `temp-${now}`;

      dispatch({ type: 'ADD_NOTE_TO_SEED', payload: { collectionId, userId: profile.id, title: titleTrim, note: noteTrim, tempId } });

      // Insert note into database
      try {
        const newNote = await insertUserSeedNote(profile.id, collectionId, titleTrim, noteTrim);
        dispatch({ type: 'REPLACE_NOTE_IN_SEED', payload: { collectionId, tempId, note: newNote } });
        console.log('✅ Note added to seed:', collectionId);
      } catch (error) {
        console.error('Error adding note to seed:', error instanceof Error ? error.message : 'Unknown error');
      }
    },
    [profile?.id],
  );

  const updateNoteInSeed = useCallback(
    async (noteId: string, title: string | null, note: string) => {
      if (!profile?.id) return;
      if (noteId.startsWith('temp-')) return;

      const titleTrim = title?.trim() ?? null;
      const noteTrim = note.trim();
      if (!noteTrim) return;

      // Optimistically update note in state
      dispatch({ type: 'UPDATE_NOTE_IN_SEED', payload: { noteId, title: titleTrim, note: noteTrim } });

      // Update note in database
      try {
        await updateUserSeedNote(profile.id, noteId, titleTrim, noteTrim);
        console.log('✅ Note updated in seed:', noteId);
      } catch (error) {
        console.error('Error updating note in seed:', error);
      }
    },
    [profile?.id],
  );

  const deleteNoteFromSeed = useCallback(
    async (noteId: string) => {
      if (!profile?.id) return;
      if (noteId.startsWith('temp-')) return;

      // Optimistically delete note in state
      dispatch({ type: 'DELETE_NOTE_FROM_SEED', payload: { noteId } });

      // Delete note from database
      try {
        await deleteUserSeedNote(profile.id, noteId);
        console.log('✅ Note deleted from seed:', noteId);
      } catch (error) {
        console.error('Error deleting note from seed:', error instanceof Error ? error.message : 'Unknown error');
      }
    },
    [profile?.id],
  );

  const addPhotoToSeed = useCallback(
    async (collectionId: string) => {
      if (!profile?.id) return;

      const picked = await pickImage();
      if (!picked) return;

      const now = new Date().toISOString();
      const tempId = `temp-photo-${now}`;

      const optimisticPhoto: UserSeedPhoto = {
        id: tempId,
        userCollectionId: collectionId,
        userId: profile.id,
        imageUrl: picked.uri, // local preview immediately
        createdAt: now,
      };

      dispatch({ type: 'ADD_PHOTO_TO_SEED', payload: { collectionId, photo: optimisticPhoto } });

      try {
        const imagePath = await uploadImage(profile.id, picked.mimeType, picked.base64);
        if (!imagePath) throw new Error('Failed to upload photo');

        const insertedPhoto = await insertUserSeedPhoto(profile.id, collectionId, imagePath);
        const signedUrl = await getSignedSeedImageUrl(insertedPhoto.imageUrl);

        dispatch({
          type: 'REPLACE_PHOTO_IN_SEED',
          payload: {
            collectionId,
            tempId,
            photo: { ...insertedPhoto, imageUrl: signedUrl ?? insertedPhoto.imageUrl },
          },
        });
      } catch (error) {
        dispatch({ type: 'DELETE_PHOTO_FROM_SEED', payload: { photoId: tempId } });
        console.error('Error adding photo to seed:', error instanceof Error ? error.message : 'Unknown error');
      }
    },
    [profile?.id],
  );

  const deletePhotoFromSeed = useCallback(
    async (photoId: string, imagePathOrUrl: string) => {
      if (!profile?.id) return;

      const photoToDelete =
        state.seeds
          .flatMap((seed) => (seed.photos ?? []).map((photo) => ({ seedId: seed.id, photo })))
          .find((entry) => entry.photo.id === photoId) ?? null;

      if (!photoToDelete) return;

      dispatch({ type: 'DELETE_PHOTO_FROM_SEED', payload: { photoId } });

      try {
        if (!photoId.startsWith('temp-photo-')) {
          await deleteUserSeedPhoto(profile.id, photoId);
        }

        const storagePath = imagePathOrUrl.includes('/storage/v1/object/sign/')
          ? decodeURIComponent(imagePathOrUrl.split('/object/sign/')[1]?.split('?')[0] ?? '')
          : imagePathOrUrl;

        if (storagePath && !storagePath.startsWith('http')) {
          await deleteSeedImage(storagePath);
        }
      } catch (error) {
        dispatch({
          type: 'RESTORE_PHOTO_TO_SEED',
          payload: { collectionId: photoToDelete.seedId, photo: photoToDelete.photo },
        });
        console.error('Error deleting photo from seed:', error instanceof Error ? error.message : 'Unknown error');
      }
    },
    [profile?.id, state.seeds],
  );

  const value = useMemo(
    () => ({
      seeds: state.seeds,
      loading: state.loading,
      error: state.error,
      addSeedFromCatalog,
      addCustomSeed,
      deleteSeedByCatalogId,
      deleteSeedByCustomId,
      addNoteToSeed,
      updateNoteInSeed,
      deleteNoteFromSeed,
      addPhotoToSeed,
      deletePhotoFromSeed,
    }),
    [
      state.seeds,
      state.loading,
      state.error,
      addSeedFromCatalog,
      addCustomSeed,
      deleteSeedByCatalogId,
      deleteSeedByCustomId,
      addNoteToSeed,
      updateNoteInSeed,
      deleteNoteFromSeed,
      addPhotoToSeed,
      deletePhotoFromSeed,
    ],
  );

  return <UserSeedsContext.Provider value={value}>{children}</UserSeedsContext.Provider>;
}

// ---- CUSTOM HOOK (use in components to access the filter context) ----
export function useUserSeeds() {
  const context = useContext(UserSeedsContext);
  if (!context) throw new Error('useUserSeeds must be used within a UserSeedsProvider');
  return context;
}
