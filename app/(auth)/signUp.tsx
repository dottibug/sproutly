import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, Pressable, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '../../state/auth/AuthContext';
import { validateSignUp } from '../../state/auth/authUtils';
import Logo from '../../components/app/Logo';
import Input from '../../components/ui/form/Input';
import AppButton from '../../components/ui/buttons/AppButton';
import { colors } from '../../styles/theme';

// (auth)/signUp.tsx: Sign up page for the app
export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const windowWidth = useWindowDimensions().width;
  const buttonWidth = windowWidth - PADDING * 2;

  const handleSignUp = async () => {
    const error = validateSignUp(username);

    if (error) {
      Alert.alert(error);
      return;
    }

    try {
      setSubmitting(true);
      await signUp(username);
      router.replace('/(tabs)/home');
    } catch {
      Alert.alert(SIGN_UP_FAILED, SIGN_UP_FAIL_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignIn = () => router.replace('/(auth)/');

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Logo size="medium" />

      <View style={styles.formContainer}>
        <Text style={styles.description}>{SUBTITLE}</Text>

        <View style={styles.inputContainer}>
          {/* Username Input */}
          <Input label="Username" placeholder="Username" value={username} onChangeText={(text) => setUsername(text)} />
        </View>

        <View style={styles.buttonContainer}>
          {/* Create Account button */}
          <AppButton
            text={submitting ? CREATING_ACCOUNT : CREATE_ACCOUNT}
            onPress={handleSignUp}
            disabled={submitting}
            width={buttonWidth}
          />
          {/* Sign in link */}
          <Pressable style={styles.signInLink} onPress={handleSignIn}>
            <Text style={styles.signInLinkText}>{SIGN_IN}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ---- CONSTANTS ----
const SUBTITLE = 'Choose a username';
const CREATE_ACCOUNT = 'Create account';
const CREATING_ACCOUNT = 'Creating...';
const SIGN_UP_FAILED = 'Sign up failed';
const SIGN_UP_FAIL_MESSAGE = 'Username may be taken already';
const SIGN_IN = 'Already have an account? Sign in';
const PADDING = 48;

// ---- STYLES ----
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  formContainer: {
    alignItems: 'center',
    marginTop: 48,
    paddingHorizontal: 48,
  },
  description: {
    fontSize: 18,
    color: colors.secondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    gap: 24,
  },
  buttonContainer: {
    gap: 16,
    paddingHorizontal: PADDING,
    marginTop: 32,
  },
  signInLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  signInLinkText: {
    color: colors.greenDark,
    fontSize: 16,
    textDecorationColor: colors.greenDark,
    textDecorationLine: 'underline',
  },
});
