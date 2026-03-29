import { Alert, KeyboardAvoidingView, Text, Platform, StyleSheet, Pressable, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '../../state/auth/AuthContext';
import { validateSignIn } from '../../state/auth/authUtils';
import Logo from '../../components/app/Logo';
import Input from '../../components/ui/form/Input';
import AppButton from '../../components/ui/buttons/AppButton';
import { colors } from '../../styles/theme';

// (auth)/index.tsx: Sign in page for the app
export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const windowWidth = useWindowDimensions().width;
  const buttonWidth = windowWidth - PADDING * 2;

  const handleSignIn = async () => {
    const error = validateSignIn(username, pin);

    if (error) {
      Alert.alert(error);
      return;
    }

    try {
      setSubmitting(true);
      await signIn(username, pin);
      router.replace('/(tabs)/home');
    } catch {
      Alert.alert(SIGN_IN_FAILED, SIGN_IN_FAIL_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignUp = () => router.push('/(auth)/signUp');

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Logo size="medium" />

      <View style={styles.formContainer}>
        <Text style={styles.description}>{SUBTITLE}</Text>

        <View style={styles.inputContainer}>
          {/* Username Input */}
          <Input label="Username" placeholder="Username" value={username} onChangeText={(text) => setUsername(text)} />
          {/* PIN Input */}
          <Input label="PIN" placeholder="PIN" value={pin} onChangeText={(text) => setPin(text)} secureTextEntry={true} />
        </View>

        <View style={styles.buttonContainer}>
          {/* Sign in button */}
          <AppButton text={submitting ? SIGNING_IN : SIGN_IN} onPress={handleSignIn} disabled={submitting} width={buttonWidth} />
          {/* Sign up link */}
          <Pressable style={styles.signUpLink} onPress={handleSignUp}>
            <Text style={styles.signUpLinkText}>{CREATE_ACCOUNT}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// KeyboardAvoidingView keeps the keyboard from covering the input fields
// https://reactnative.dev/docs/keyboardavoidingview

// ---- CONSTANTS ----
const SUBTITLE = 'Sign in with your username and PIN';
const SIGN_IN = 'Sign in';
const CREATE_ACCOUNT = 'Create an account';
const SIGN_IN_FAILED = 'Sign in failed';
const SIGN_IN_FAIL_MESSAGE = 'Please check your username and PIN';
const SIGNING_IN = 'Signing in...';
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
  signUpLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  signUpLinkText: {
    color: colors.greenDark,
    fontSize: 16,
    textDecorationColor: colors.greenDark,
    textDecorationLine: 'underline',
  },
});
