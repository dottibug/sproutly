import { NoteAction, UserSeedNote, NoteDraft } from '../notes/noteTypes';
import { PhotoAction, ImagePreview, UserSeedPhoto, AddPhotoDraft } from '../photos/photoTypes';
import { TaskAction, UserSeedTask, TaskStatus, TaskDraft } from '../tasks/taskTypes';
import { CustomSeedPayload } from '../../customSeed/customSeedTypes';
import { Category, Planting } from './seedInfoTypes';
import { BrowseSeed } from '../../browseSeeds/browseTypes';

export type AddSeedFromBrowseResult = 'added' | 'duplicate' | 'failed' | 'no_user';

// ---- ACTIONS ----
export type UserSeedAction = SeedAction | NoteAction | PhotoAction | TaskAction;

export type SeedAction =
  | { type: 'LOAD_START'; payload: null }
  | { type: 'LOAD_SUCCESS'; payload: UserSeed[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'ADD_SEED_FROM_BROWSE'; payload: { browseSeed: BrowseSeed; tempId: string } }
  | { type: 'SYNC_BROWSE_SEED_WITH_DB'; payload: { tempId: string; id: string } }
  | { type: 'ADD_CUSTOM_SEED'; payload: UserSeed }
  | { type: 'SYNC_CUSTOM_SEED_WITH_DB'; payload: UserSeed & { tempId: string } }
  | { type: 'DELETE_BY_CATALOG_ID'; payload: UserSeed['catalogSeedId'] }
  | { type: 'DELETE_BY_CUSTOM_ID'; payload: UserSeed['customSeedId'] }
  | { type: 'SET_SEED_FAVORITE'; payload: { collectionId: string; isFavorite: boolean } };

// ---- STATE ----
export type UserSeedState = {
  seeds: UserSeed[];
  loading: boolean;
  error: string | null;
};

// ---- CONTEXT ----
export type UserSeedContextValue = {
  seeds: UserSeed[];
  loading: boolean;
  error: string | null;
  addSeedFromBrowse: (seed: BrowseSeed) => Promise<AddSeedFromBrowseResult>;
  addCustomSeed: (preview: ImagePreview | null, payload: CustomSeedPayload) => Promise<void>;
  deleteByCatalogId: (seed: UserSeed) => Promise<void>;
  deleteByCustomId: (seed: UserSeed) => Promise<void>;
  setSeedFavorite: (seed: UserSeed, isFavorite: boolean) => Promise<void>;
  addNote: (draft: NoteDraft) => Promise<void>;
  updateNote: (note: UserSeedNote, draft: NoteDraft) => Promise<void>;
  deleteNote: (note: UserSeedNote) => Promise<void>;
  addPhoto: (draft: AddPhotoDraft) => Promise<void>;
  deletePhoto: (photoId: string) => Promise<void>;
  addTask: (draft: TaskDraft) => Promise<void>;
  updateTask: (task: UserSeedTask, draft: TaskDraft) => Promise<void>;
  deleteTask: (task: UserSeedTask) => Promise<void>;
  toggleTaskStatus: (task: UserSeedTask, newStatus: TaskStatus) => Promise<void>;
};

// ---- USER SEED ----
export type UserSeed = BrowseSeed & {
  catalogSeedId: string | null;
  customSeedId: string | null;
  isFavorite: boolean;
  notes: UserSeedNote[];
  photos: UserSeedPhoto[];
  tasks: UserSeedTask[];
};

// ---- BUILD USER SEED INPUT ----
export type BuildUserSeedInput = {
  id: string;
  catalogSeedId: string | null;
  customSeedId: string | null;
  variety: string;
  sku: string;
  category: Category;
  beanType: string | null;
  plant: string;
  latin: string | null;
  difficulty: string | null;
  exposure: string | null;
  maturesInDays: number | null;
  maturesUnderDays: number | null;
  description: string | null;
  timing: string | null;
  starting: string | null;
  growing: string | null;
  harvest: string | null;
  companionPlanting: string | null;
  image: string;
  planting: Planting[];
  isFavorite: boolean;
  notes: UserSeedNote[];
  photos: UserSeedPhoto[];
  tasks: UserSeedTask[];
};
