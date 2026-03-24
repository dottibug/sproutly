import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { UserSeedTab } from '../../../state/app/appTypes';
import { UserSeed } from '../../../state/userSeeds/seeds/seedTypes';
import { useState } from 'react';
import StartNoteModal from './StartNoteModal';
import Note from './Note';
import { FAB as PaperFAB } from 'react-native-paper';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../../styles/theme';

// TODO: Styling

function notesFabIcon({ size, color }: { size: number; color: string }) {
  return <FontAwesome5 name="sticky-note" size={size} color={color} solid />;
}

type UserSeedNotesProps = {
  readonly activeTab: UserSeedTab;
  readonly seed: UserSeed;
};

const NO_NOTES = 'No notes found. Add a note to get started.';

const FAB_BOTTOM_GAP = 16;

// UserSeedNotes component displays the notes of a single seed in the user's collection
export default function UserSeedNotes({ seed, activeTab }: UserSeedNotesProps) {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const [showStartNoteModal, setShowStartNoteModal] = useState(false);

  const notes = seed.notes ?? [];
  const hasNotes = notes.length > 0;

  return (
    <View style={[styles.screen, { display: activeTab === 'Notes' ? 'flex' : 'none' }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: FAB_BOTTOM_GAP + 56 + tabBarHeight + insets.bottom + 16 },
        ]}
      >
        {!hasNotes && <Text style={styles.empty}>{NO_NOTES}</Text>}

        {hasNotes && (
          <View style={styles.list}>
            {notes.map((n) => (
              <Note key={n.id} note={n} />
            ))}
          </View>
        )}
      </ScrollView>

      <PaperFAB
        accessibilityLabel="Add note"
        icon={notesFabIcon}
        style={[
          styles.fab,
          {
            backgroundColor: colors.hunterGreen,
            bottom: FAB_BOTTOM_GAP + tabBarHeight + insets.bottom,
            right: FAB_BOTTOM_GAP,
          },
        ]}
        color={colors.white}
        onPress={() => setShowStartNoteModal(true)}
      />

      {showStartNoteModal && (
        <StartNoteModal visible={showStartNoteModal} onRequestClose={() => setShowStartNoteModal(false)} userSeedId={seed.id} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: 'relative',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  empty: {
    marginVertical: 16,
    textAlign: 'center',
  },
  list: {
    gap: 16,
  },
  fab: {
    position: 'absolute',
  },
});
