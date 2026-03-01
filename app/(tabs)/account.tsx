import { Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '../../lib/contexts/AuthContext';
import { useRouter } from 'expo-router';

// Account tab screen
export default function AccountScreen() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    console.log('Signing out');
    await signOut();
    console.log('Signed out');
    router.replace('/(auth)/');
    console.log('Redirected to auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <Text>Account information will go here.</Text>
      <Text>change username</Text>
      <Text>change avatar</Text>
      <Text>delete account</Text>

      <Pressable style={styles.signOut} onPress={handleSignOut}>
        <MaterialIcons name="logout" size={24} color="black" />
        <Text style={styles.signOutText}>Sign out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 24,
  },
  signOutText: {
    fontSize: 18,
  },
});
