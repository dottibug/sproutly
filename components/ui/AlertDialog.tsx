import { Alert } from 'react-native';

// AlertDialog.tsx: Renders an alert dialog with a title, message, and a button. Used for any alert dialog in the app.

type AlertDialogProps = {
  readonly title: string;
  readonly message: string;
  readonly onPress: () => void;
};

export default function AlertDialog({ title, message, onPress }: AlertDialogProps) {
  return Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress },
  ]);
}
