import { useState } from 'react';
import { useAuth } from '../../lib/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, Pressable } from 'react-native';
import { colors, typography } from '../../styles/theme';

const TITLE = 'Create an account';
const SUBTITLE = 'Choose a username';
const CREATE_ACCOUNT = 'Create account';
const CREATING_ACCOUNT = 'Creating...';
const SIGN_IN = 'Already have an account? Sign in';

export default function SignUp() {
  console.log('SignUp Screen Reached');

  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signUp, error, clearError } = useAuth();
  const router = useRouter();

  const handleSignUp = async () => {
    const usernameTrim = username.trim();

    if (!username) {
      Alert.alert('Username required');
      return;
    }

    setSubmitting(true);
    clearError();

    try {
      await signUp(usernameTrim);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Sign up failed', error instanceof Error ? error.message : 'Username may be taken already');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text style={styles.title}>{TITLE}</Text>
      <Text style={styles.subtitle}>{SUBTITLE}</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          clearError();
        }}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Create Account Button */}
      <Pressable style={[styles.button, submitting && styles.buttonDisabled]} onPress={handleSignUp} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? CREATING_ACCOUNT : CREATE_ACCOUNT}</Text>
      </Pressable>

      {/* Sign in link */}
      <Pressable style={styles.signInLink} onPress={() => router.replace('/(auth)/')}>
        <Text style={styles.signInLinkText}>{SIGN_IN}</Text>
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
  button: {
    backgroundColor: colors.hunterGreen,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: typography.textMedium.fontSize,
    fontWeight: 'bold',
  },
  signInLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  signInLinkText: {
    color: colors.blue,
  },
});
