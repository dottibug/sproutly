import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Text } from 'react-native';
import { colors } from '../../styles/theme';

// https://reactnative.dev/docs/activityindicator

type LoadingProps = {
  readonly message: string;
};

// Loading component with a message
export default function Loading({ message }: LoadingProps) {
  return (
    <SafeAreaView>
      <ActivityIndicator size="large" color={colors.greenDark} />
      <Text>{message}</Text>
    </SafeAreaView>
  );
}
