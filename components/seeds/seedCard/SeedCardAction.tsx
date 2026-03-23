import { View, Text, StyleSheet } from 'react-native';
import SeedCardOverlay from './SeedCardOverlay';
import { colors } from '../../../styles/theme';
import Button from '../../ui/buttons/AppButton';

const CANCEL = 'Cancel';
const ADD = 'Add';
const DELETE = 'Delete';

type SeedCardActionProps = {
  readonly variety: string;
  readonly plant: string;
  readonly action: typeof ADD | typeof DELETE;
  readonly onCancel: () => void;
  readonly onAction: () => void;
};

// SeedCardAction component displays the action buttons for a single seed in the user's collection or the browse list
export default function SeedCardAction({ variety, plant, action, onCancel, onAction }: SeedCardActionProps) {
  const seed = `${variety} ${plant}`;
  const actionColor = action === ADD ? 'primary' : 'danger';
  const actionIcon = action === ADD ? 'add' : 'delete';

  return (
    <SeedCardOverlay>
      <Text style={styles.message}>
        {action}
        <Text style={styles.seed}>{` ${seed}`}</Text>
        {`?`}
      </Text>
      <View style={styles.buttons}>
        <Button text={CANCEL} onPress={onCancel} color="secondary" width={108} icon="cancel" size="small" />

        <Button text={action} onPress={onAction} color={actionColor} width={108} icon={actionIcon} size="small" />
      </View>
    </SeedCardOverlay>
  );
}

const styles = StyleSheet.create({
  message: {
    fontSize: 16,
  },
  seed: {
    fontWeight: 'bold',
    color: colors.teal,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
