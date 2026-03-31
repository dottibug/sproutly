import { ActivityIndicator, Text, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Logo from '../app/Logo';
import { colors } from '../../styles/theme';

// AppLoadingScreen.tsx: Initial loading screen for the app

export default function AppLoadingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Logo size="large" />
      <View style={styles.loadingMessageContainer}>
        <ActivityIndicator size="large" color={colors.greenDark} />
        <Text style={styles.message}>Seeds sprouting...</Text>
      </View>
    </SafeAreaView>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 32,
    marginTop: -64,
  },
  loadingMessageContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginTop: 48,
  },
  message: {
    color: colors.greenDark,
    fontSize: 20,
    marginRight: 10,
  },
});
