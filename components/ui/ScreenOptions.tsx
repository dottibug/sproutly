import { Stack } from 'expo-router';
import { colors } from '../../styles/theme';

type ScreenOptionsProps = {
  readonly backButtonMode?: 'minimal' | 'generic';
};

// ScreenOptions.tsx: Drop-in component for setting screen options where needed.
export default function ScreenOptions({ backButtonMode = 'minimal' }: ScreenOptionsProps) {
  return (
    <Stack.Screen
      options={{
        headerTintColor: colors.greenMedium,
        headerBackButtonDisplayMode: backButtonMode,
        headerBackTitleStyle: { fontSize: 16 },
      }}
    />
  );
}
