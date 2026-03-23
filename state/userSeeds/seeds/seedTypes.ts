import { NoteAction, UserSeedNote, AddNoteDraft } from '../notes/noteTypes';
import { PhotoAction, ImagePreview, UserSeedPhoto, AddPhotoDraft } from '../photos/photoTypes';
import { TaskAction, UserSeedTask, TaskStatus, AddTaskDraft } from '../tasks/taskTypes';
import { CustomSeedPayload } from '../../customSeedForm/customSeedTypes';
import { Category, Planting } from './seedInfoTypes';
import { BrowseSeed } from '../../browseSeeds/browseTypes';

// ---- ACTIONS ----
export type UserSeedAction = SeedAction | NoteAction | PhotoAction | TaskAction;

export type SeedAction =
  | { type: 'LOAD_START'; payload: null }
  | { type: 'LOAD_SUCCESS'; payload: UserSeed[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'ADD_SEED_FROM_BROWSE'; payload: BrowseSeed }
  | { type: 'ADD_CUSTOM_SEED'; payload: UserSeed }
  | { type: 'SYNC_CUSTOM_SEED_WITH_DB'; payload: UserSeed & { tempId: string } }
  | { type: 'DELETE_BY_CATALOG_ID'; payload: UserSeed['catalogSeedId'] }
  | { type: 'DELETE_BY_CUSTOM_ID'; payload: UserSeed['customSeedId'] };

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
  addSeedFromBrowse: (seed: BrowseSeed) => Promise<void>;
  addCustomSeed: (preview: ImagePreview | null, payload: CustomSeedPayload) => Promise<void>;
  deleteByCatalogId: (seed: UserSeed) => Promise<void>;
  deleteByCustomId: (seed: UserSeed) => Promise<void>;
  addNote: (draft: AddNoteDraft) => Promise<void>;
  updateNote: (payload: UserSeedNote) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  addPhoto: (draft: AddPhotoDraft) => Promise<void>;
  deletePhoto: (photoId: string) => Promise<void>;
  addTask: (draft: AddTaskDraft) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskStatus: (task: UserSeedTask, newStatus: TaskStatus) => Promise<void>;
};

// ---- USER SEED ----
export type UserSeed = BrowseSeed & {
  catalogSeedId: string | null;
  customSeedId: string | null;
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
  notes: UserSeedNote[];
  photos: UserSeedPhoto[];
  tasks: UserSeedTask[];
};
