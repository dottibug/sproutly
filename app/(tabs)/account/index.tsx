import { Text, View, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../state/auth/AuthContext';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Logo from '../../../components/app/Logo';
import { appStyles, colors } from '../../../styles/theme';

// (tabs)/account/index.tsx: Account screen gives access to profile, settings, and sign out.
export default function Account() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleProfile = () => router.push('/(tabs)/account/profile');
  const handleSettings = () => router.push('/(tabs)/account/settings');

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.contentContainer}>
        <View style={styles.logoContainer}>
          <Logo size="medium" showText={true} />
        </View>

        <View style={styles.menuContainer}>
          {/* Profile */}
          <Pressable style={({ pressed }) => [styles.menuItem, pressed && appStyles.cardPressed]} onPress={handleProfile}>
            <MaterialIcons name="person" size={24} color="black" />
            <Text style={styles.menuItemText}>Profile</Text>
          </Pressable>

          {/* Settings */}
          <Pressable style={({ pressed }) => [styles.menuItem, pressed && appStyles.cardPressed]} onPress={handleSettings}>
            <MaterialIcons name="settings" size={24} color={colors.primary} />
            <Text style={styles.menuItemText}>Settings</Text>
          </Pressable>

          {/* Sign out button */}
          <Pressable style={({ pressed }) => [styles.menuItem, pressed && appStyles.cardPressed]} onPress={handleSignOut}>
            <MaterialIcons name="logout" size={24} color={colors.primary} />
            <Text style={styles.menuItemText}>Sign out</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.gray100,
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {
    alignItems: 'center',
    flex: 1,
    marginTop: 80,
    paddingHorizontal: 16,
  },
  logoContainer: {
    alignSelf: 'center',
    marginBottom: 64,
  },
  menuContainer: {
    alignItems: 'flex-start',
    marginRight: 16,
    gap: 24,
  },
  menuItem: {
    ...appStyles.card,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    width: 180,
  },
  menuItemText: {
    fontSize: 18,
    color: colors.primary,
  },
});
