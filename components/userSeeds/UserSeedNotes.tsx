import { View, Text, Pressable } from 'react-native';
import { UserSeedTab } from '../../state/app/appTypes';
import { UserSeed } from '../../state/userSeeds/types/seedTypes';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import StartNoteModal from './notes/StartNoteModal';
import Note from './notes/Note';

// TODO: Styling

type UserSeedNotesProps = {
  readonly activeTab: UserSeedTab;
  readonly seed: UserSeed;
};

const NO_NOTES = 'No notes found. Add a note to get started.';

// UserSeedNotes component displays the notes of a single seed in the user's collection
export default function UserSeedNotes({ activeTab, seed }: UserSeedNotesProps) {
  const [showStartNoteModal, setShowStartNoteModal] = useState(false);

  const notes = seed.notes ?? [];
  const hasNotes = notes.length > 0;

  const handleStartNote = () => setShowStartNoteModal(true);

  return (
    <View style={{ flex: 1, padding: 16, display: activeTab === 'Notes' ? 'flex' : 'none' }}>
      {!hasNotes && <Text style={{ marginVertical: 16, textAlign: 'center' }}>{NO_NOTES}</Text>}

      {hasNotes && (
        <View style={{ gap: 16 }}>
          {notes.map((n) => (
            <Note key={n.id} note={n} />
          ))}
        </View>
      )}

      <Pressable style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 16 }} onPress={handleStartNote}>
        <Ionicons name="add-circle-outline" size={48} color="black" />
      </Pressable>

      {showStartNoteModal && (
        <StartNoteModal visible={showStartNoteModal} onRequestClose={() => setShowStartNoteModal(false)} userSeedId={seed.id} />
      )}
    </View>
  );
}
