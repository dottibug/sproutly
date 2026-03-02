import { View, Text, StyleSheet } from 'react-native';
import SeedCardOverlay from './SeedCardOverlay';
import { colors } from '../../../styles/theme';
import Button from '../buttons/Button';

const CANCEL = 'Cancel';
const ADD = 'Add';
const DELETE = 'Delete';

type SeedCardActionProps = {
  readonly seedName: string;
  readonly seedCategory: string;
  readonly action: typeof ADD | typeof DELETE;
  readonly onCancel: () => void;
  readonly onAction: () => void;
};

export default function SeedCardAction({ seedName, seedCategory, action, onCancel, onAction }: SeedCardActionProps) {
  const seed = `${seedName} ${seedCategory}`;
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
