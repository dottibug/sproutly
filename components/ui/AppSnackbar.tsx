import { Snackbar as PaperSnackbar } from 'react-native-paper';
import { useState } from 'react';

// TODO: styles

type AppSnackbarProps = {
  readonly children: React.ReactNode;
};

// Snackbar.tsx: Displays a snackbar message at the bottom of the screen.
export default function AppSnackbar({ children }: AppSnackbarProps) {
  const [visible, setVisible] = useState(false);

  const onToggleSnackBar = () => setVisible(!visible);
  const onDismissSnackBar = () => setVisible(false);

  return (
    <PaperSnackbar
      visible={visible}
      onDismiss={onDismissSnackBar}
      action={{
        label: 'Close',
        onPress: onToggleSnackBar,
      }}>
      {children}
    </PaperSnackbar>
  );
}

// ---- REFERENCES ----
// https://oss.callstack.com/react-native-paper/docs/components/Snackbar
