import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ScreenContainerProps = {
  readonly children: React.ReactNode;
};

export default function ScreenContainer({ children }: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.screenContainer} edges={['left', 'right']}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});
