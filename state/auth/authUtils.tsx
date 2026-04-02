// authUtils.tsx: Contains authentication utility functions

// ---- AUTH TYPES & CONSTANTS ----
export const AUTH_FAKE_EMAIL_DOMAIN = 'sproutly.com';
export const UNIVERSAL_PIN = '123456';

export type Profile = {
  id: string;
  username: string;
  createdAt: string | null;
};

// ---- SIGN-IN/SIGN-UP UTILS ----
// Create a fake email for the user
export function getAuthEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${AUTH_FAKE_EMAIL_DOMAIN}`;
}

// Validate sign in form inputs
export function validateSignIn(username: string, pin: string): string | null {
  const usernameTrim = username.trim();
  const pinTrim = pin.trim();

  if (!usernameTrim && !pinTrim) return 'Please enter a username and PIN';
  if (!usernameTrim) return 'Please enter username';
  if (!pinTrim) return 'Enter your PIN';

  return null;
}

// Validate sign up form inputs
export function validateSignUp(username: string): string | null {
  const usernameTrim = username.trim();
  if (!usernameTrim) return 'Please enter username';
  return null;
}

// Supabase error alerts
export function getSignUpAlertContent(error: unknown): { title: string; message: string } {
  const code =
    error && typeof error === 'object' && 'code' in error && typeof (error as { code: unknown }).code === 'string'
      ? (error as { code: string }).code.toLowerCase()
      : '';

  const raw = (() => {
    if (error instanceof Error) return error.message;
    if (error && typeof error === 'object' && 'message' in error) {
      const m = (error as { message: unknown }).message;
      if (typeof m === 'string') return m;
    }
    if (typeof error === 'string') return error;
    return '';
  })();

  const lower = raw.toLowerCase();

  if (
    code === 'user_already_exists' ||
    lower.includes('already registered') ||
    lower.includes('user already') ||
    lower.includes('already exists') ||
    lower.includes('email address is already') ||
    lower.includes('email has already been registered') ||
    lower.includes('duplicate')
  ) {
    return {
      title: 'Username taken',
      message: 'That username is already in use. Choose a different one, or sign in if you already created this account.',
    };
  }

  if (lower.includes('profile was not created') || lower.includes('profile not found')) {
    return {
      title: "Couldn't finish sign-up",
      message: 'We could not finish setting up your profile. Try signing in, or wait a moment and try again.',
    };
  }

  if (lower.includes('sign up') && lower.includes('disabled')) {
    return {
      title: 'Sign up unavailable',
      message: 'Creating new accounts is turned off right now. Please try again later or sign in with an existing account.',
    };
  }

  if (lower.includes('network') || lower.includes('fetch failed') || lower.includes('network request failed')) {
    return {
      title: 'Connection problem',
      message: 'Check your internet connection and try again.',
    };
  }

  return {
    title: 'Sign up failed',
    message: raw.trim().length > 0 ? raw : 'Something went wrong. Please try again.',
  };
}
