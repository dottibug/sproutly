import { Alert } from 'react-native';

type AlertDialogProps = {
  readonly title: string;
  readonly message: string;
  readonly onPress: () => void;
};

// AlertDialog.tsx: Renders an alert dialog with a title, message, and a button. Used for any alert dialog in the app.
export default function AlertDialog({ title, message, onPress }: AlertDialogProps) {
  return Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress },
  ]);
}
