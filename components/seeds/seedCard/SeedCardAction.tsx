import { View, Text, StyleSheet, Modal, Pressable, Platform } from 'react-native';
import { UserSeed } from '../../../state/userSeeds/seeds/seedTypes';
import { colors } from '../../../styles/theme';
import Button from '../../ui/buttons/AppButton';
import SeedImage from '../SeedImage';
import SeedCardInfo from './SeedCardInfo';

const CANCEL = 'Cancel';
const ADD = 'Add';
const DELETE = 'Delete';

const MODAL_BACKDROP = 'rgba(0, 0, 0, 0.4)';

type SeedCardActionProps = {
  readonly variety: string;
  readonly plant: string;
  readonly action: typeof ADD | typeof DELETE;
  readonly onCancel: () => void;
  readonly onAction: () => void;
  /** My Seeds delete: full seed for list-matching preview (image, category, etc.). */
  readonly seed?: UserSeed;
};

// SeedCardAction — confirmation for delete (and add if used later). Delete uses a dimmed overlay like the filter sheet and a card styled like list seed cards.
export default function SeedCardAction({ variety, plant, action, onCancel, onAction, seed }: SeedCardActionProps) {
  const seedLabel = `${variety} ${plant}`.trim();
  const actionColor = action === ADD ? 'primary' : 'danger';
  const actionIcon = action === ADD ? 'add' : 'delete';
  const showSeedPreview = action === DELETE && seed != null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onCancel} statusBarTranslucent>
      <View style={styles.modalRoot}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} accessibilityLabel="Dismiss" accessibilityRole="button" />
        <View style={styles.cardWrap} pointerEvents="box-none">
          <View style={styles.confirmCard}>
            {showSeedPreview ? (
              <>
                <View style={styles.previewRow}>
                  <SeedImage imageUri={seed.image} size="small" />
                  <View style={styles.previewMain}>
                    <SeedCardInfo
                      variety={seed.variety}
                      plant={seed.plant}
                      beanType={seed.beanType}
                      category={seed.category}
                      cardType="user"
                    />
                  </View>
                </View>
                <Text style={styles.prompt}>Remove this seed from My Seeds?</Text>
              </>
            ) : (
              <Text style={styles.message}>
                {action}
                <Text style={styles.seedName}>{` ${seedLabel}`}</Text>
                ?
              </Text>
            )}

            <View style={styles.buttons}>
              <View style={styles.buttonFlex}>
                <Button text={CANCEL} onPress={onCancel} color="secondary" width="100%" icon="cancel" size="small" />
              </View>
              <View style={styles.buttonFlex}>
                <Button text={action} onPress={onAction} color={actionColor} width="100%" icon={actionIcon} size="small" />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: MODAL_BACKDROP,
  },
  cardWrap: {
    width: '100%',
    maxWidth: '100%',
  },
  confirmCard: {
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(56, 104, 76, 0.2)',
    paddingVertical: 14,
    paddingHorizontal: 12,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 96,
  },
  previewMain: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  prompt: {
    marginTop: 16,
    fontSize: 15,
    lineHeight: 21,
    color: colors.secondary,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
  seedName: {
    fontWeight: '600',
    color: colors.teal,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    width: '100%',
  },
  buttonFlex: {
    flex: 1,
    minWidth: 0,
  },
});
