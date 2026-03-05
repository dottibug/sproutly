import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Fragment } from 'react';

type ScreenContainerProps = {
  readonly children: React.ReactNode;
  readonly fullScreen?: boolean;
};

export default function ScreenContainer({ children, fullScreen = false }: ScreenContainerProps) {
  return (
    <Fragment>
      {fullScreen ? (
        <SafeAreaView style={styles.fullScreenContainer} edges={['bottom', 'left', 'right']}>
          {children}
        </SafeAreaView>
      ) : (
        <SafeAreaView style={styles.screenContainer} edges={['left', 'right']}>
          {children}
        </SafeAreaView>
      )}
    </Fragment>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});
