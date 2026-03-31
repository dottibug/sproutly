import { Stack } from 'expo-router';
import { colors } from '../../styles/theme';

// ScreenOptions.tsx: Drop-in component for setting screen options where needed.

type ScreenOptionsProps = {
  readonly backButtonMode?: 'minimal' | 'generic';
  readonly title?: string;
  readonly backTitle?: string;
};

export default function ScreenOptions({ backButtonMode = 'minimal', title = '', backTitle = 'Back' }: ScreenOptionsProps) {
  return (
    <Stack.Screen
      options={{
        headerTintColor: colors.greenMedium,
        headerBackButtonDisplayMode: backButtonMode,
        headerBackTitleStyle: { fontSize: 16 },
        title: title || '',
        headerBackTitle: backTitle || '',
        headerTitleAlign: 'center',
        headerTitleStyle: { fontSize: 16 },
      }}
    />
  );
}
