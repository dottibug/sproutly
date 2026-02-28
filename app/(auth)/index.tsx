import { useState } from 'react';
import { useAuth } from '../../lib/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Alert, KeyboardAvoidingView, Text, Platform, StyleSheet, TextInput, Pressable } from 'react-native';
import { colors, typography } from '../../styles/theme';

// KeyboardAvoidingView keeps the keyboard from covering the input fields
// https://reactnative.dev/docs/keyboardavoidingview

const TITLE = 'Welcome back!';
const SUBTITLE = 'Sign in with your username and PIN';
const SIGN_IN = 'Sign in';
const SIGNING_IN = 'Signing in...';
const SIGN_UP = 'Sign up';
const CREATE_ACCOUNT = 'Create an account';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signIn, error, clearError } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    const usernameTrim = username.trim();

    if (!usernameTrim || !pin) {
      Alert.alert('Enter username and PIN');
      return;
    }

    setSubmitting(true);

    clearError();

    try {
      await signIn(usernameTrim, pin);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Sign in failed', error instanceof Error ? error.message : 'Please check username and PIN');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>{TITLE}</Text>
      <Text style={styles.subtitle}>{SUBTITLE}</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* PIN Input */}
      <TextInput
        style={styles.input}
        placeholder="PIN"
        value={pin}
        onChangeText={(text) => setPin(text)}
        secureTextEntry
        keyboardType="number-pad"
      />

      <Pressable style={[styles.signInButton, submitting && styles.signInButtonDisabled]} onPress={handleSignIn} disabled={submitting}>
        <Text style={styles.signInButtonText}>{submitting ? SIGNING_IN : SIGN_IN}</Text>
      </Pressable>

      {/* Sign up link */}
      <Pressable style={styles.signUpLink} onPress={() => router.push('/(auth)/signUp')}>
        <Text style={styles.signUpLinkText}>{CREATE_ACCOUNT}</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 24,
  },
  error: {
    color: colors.red,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: 14,
    fontSize: typography.textMedium.fontSize,
    marginBottom: 12,
  },
  signInButton: {
    backgroundColor: colors.hunterGreen,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  signInButtonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: colors.white,
    fontSize: typography.textMedium.fontSize,
    fontWeight: 'bold',
  },
  signUpLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  signUpLinkText: {
    color: colors.blue,
  },
});
