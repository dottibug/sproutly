// ---- PROFILE TYPES ----
export type Profile = {
  id: string;
  username: string;
  createdAt: string | null;
};

export type ListTab = 'My Seeds' | 'Browse';
export type UserSeedTab = 'Seed' | 'Notes' | 'Photos' | 'Tasks';

// ---- CONSTANTS ----
export const LIST_TABS = ['My Seeds', 'Browse'];
export const USER_SEED_TABS = ['Seed', 'Notes', 'Photos', 'Tasks'];
export const FAB_MARGIN_RIGHT = 16;
