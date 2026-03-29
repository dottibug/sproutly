import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { UserSeedNote } from '../../../state/userSeeds/notes/noteTypes';
import { formatISODate } from '../../../state/app/dateUtils';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Heading from '../../ui/Heading';
import { colors } from '../../../styles/theme';

type NoteProps = {
  readonly note: UserSeedNote;
  readonly onEdit?: (note: UserSeedNote) => void;
  readonly onDelete?: (note: UserSeedNote) => void;
};

// Note.tsx: Renders a single note card.
export default function Note({ note, onEdit, onDelete }: NoteProps) {
  const hasNote = note.note !== null && note.note !== '';
  const dateText = `Added ${formatISODate(note.createdAt)}`;
  const noteText = hasNote ? note.note : 'This note has no content.';

  const handleEdit = () => onEdit?.(note);
  const handleDelete = () => onDelete?.(note);

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Heading size="xsmall">{note.title}</Heading>
        <Text style={styles.noteText}>{noteText}</Text>
      </View>
      <View style={styles.cardBottomRow}>
        <View style={styles.actionButtons}>
          <Pressable onPress={handleEdit} style={styles.actionButton}>
            <FontAwesome6 name="pencil" size={18} color={colors.secondary} />
          </Pressable>
          <Pressable onPress={handleDelete} style={styles.actionButton}>
            <FontAwesome6 name="trash-can" size={18} color={colors.secondary} />
          </Pressable>
        </View>
        <Text style={styles.dateText}>{dateText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 16,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.13,
        shadowRadius: 14,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  info: {
    flexDirection: 'column',
    gap: 8,
  },
  cardBottomRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    marginBottom: 0,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: colors.gray200,
    borderRadius: 100,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    alignSelf: 'flex-end',
    fontSize: 14,
    color: colors.secondary,
  },
  noteText: {
    fontSize: 16,
    lineHeight: 20,
  },
});
