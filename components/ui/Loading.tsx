import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Text } from 'react-native';
import { colors } from '../../styles/theme';

// https://reactnative.dev/docs/activityindicator

type LoadingProps = {
  readonly message: string;
};

export default function Loading({ message }: LoadingProps) {
  return (
    <SafeAreaView>
      <ActivityIndicator size="large" color={colors.hunterGreen} />
      <Text>{message}</Text>
    </SafeAreaView>
  );
}
