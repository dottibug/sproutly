import { View, StyleSheet, Platform, Text, Pressable } from 'react-native';
import { colors } from '../../../styles/theme';

// SeedCardDeleteOverlay.tsx: Displays an overlay on a seed card to display the delete confirmation dialog. Users can delete the seed or cancel.

type SeedCardDeleteOverlayProps = {
  readonly seedName: string;
  readonly onDelete: () => void;
  readonly onCancel: () => void;
};

export default function SeedCardDeleteOverlay({ seedName, onDelete, onCancel }: SeedCardDeleteOverlayProps) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.deleteConfirmation}>
          <View style={styles.deleteMsgContainer}>
            <View style={styles.deleteMsgRow}>
              <Text style={styles.deleteMsg}>{`Delete `}</Text>
              <Text style={[styles.seedNameDelete, styles.deleteMsg]}>{seedName}</Text>
              <Text style={styles.deleteMsg}>{`?`}</Text>
            </View>
            <Text style={styles.warningMsg}>This cannot be undone.</Text>
          </View>
          <View style={styles.buttons}>
            <Pressable onPress={onDelete} style={[styles.button, styles.deleteButton]}>
              <Text style={styles.buttonText}>Delete</Text>
            </Pressable>
            <Pressable onPress={onCancel} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    alignItems: 'center',
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
  content: {
    flexDirection: 'row',
    height: 120, // must match SeedImage height
    alignItems: 'center',
    gap: 18,
    padding: 16,
  },
  deleteConfirmation: {
    justifyContent: 'space-around',
    flex: 1,
    gap: 16,
  },
  deleteMsgContainer: {
    gap: 4,
  },
  deleteMsgRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  deleteMsg: {
    fontSize: 15,
  },
  seedNameDelete: {
    fontWeight: '600',
    color: colors.red,
  },
  warningMsg: {
    fontSize: 14,
    color: colors.primary,
    fontStyle: 'italic',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: colors.red,
    color: colors.white,
  },
  cancelButton: {
    backgroundColor: colors.gray500,
    color: colors.primary,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
