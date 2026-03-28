import { UserSeedNote } from './userSeeds/notes/noteTypes';
import { createContext, useReducer, useCallback, useMemo, useContext } from 'react';

/**
 * NoteContext.tsx: Handles the form state for adding or updating a note in NoteSheet.tsx
 * Follows the reducer and context pattern to manage state
 * Reference: https://react.dev/learn/scaling-up-with-reducer-and-context
 */

// ---- ACTIONS ----
type NoteAction =
  | { type: 'SET_TITLE'; payload: string | null }
  | { type: 'SET_NOTE'; payload: string }
  | { type: 'RESET_NOTE'; payload: null };

// ---- INITIAL STATE SETUP ----
type NoteState = {
  note: UserSeedNote;
};

const initialState: NoteState = {
  note: {
    id: '',
    userId: '',
    userSeedId: '',
    title: '',
    note: '',
    createdAt: '',
    updatedAt: '',
  },
};

// ---- REDUCER ----
function noteReducer(state: NoteState, action: NoteAction): NoteState {
  const { type, payload } = action;

  switch (type) {
    case 'SET_TITLE':
      return { ...state, note: { ...state.note, title: payload } };
    case 'SET_NOTE':
      return { ...state, note: { ...state.note, note: payload } };
    case 'RESET_NOTE':
      return { ...state, note: initialState.note };
    default:
      return state;
  }
}

// ---- CONTEXT SETUP ----
type NoteContext = NoteState & {
  setTitle: (title: string | null) => void;
  setNote: (note: string) => void;
  resetNote: () => void;
};

const NoteContext = createContext<NoteContext | null>(null);

// ---- PROVIDER ----
type NoteProviderProps = { readonly children: React.ReactNode };

export function NoteProvider({ children }: NoteProviderProps) {
  const [state, dispatch] = useReducer(noteReducer, initialState);

  const setTitle = useCallback((title: string | null) => dispatch({ type: 'SET_TITLE', payload: title }), []);

  const setNote = useCallback((note: string) => dispatch({ type: 'SET_NOTE', payload: note }), []);

  const resetNote = useCallback(() => dispatch({ type: 'RESET_NOTE', payload: null }), []);

  const value = useMemo(() => ({ ...state, setTitle, setNote, resetNote }), [state, setTitle, setNote, resetNote]);

  return <NoteContext.Provider value={value}>{children}</NoteContext.Provider>;
}

// ---- CUSTOM HOOK ----
export function useNote() {
  const context = useContext(NoteContext);
  if (!context) {
    throw new Error('useNote must be used within a NoteProvider');
  }
  return context;
}
