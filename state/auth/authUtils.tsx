// ---- AUTH TYPES & CONSTANTS ----
export const AUTH_FAKE_EMAIL_DOMAIN = 'sproutly.com';
export const UNIVERSAL_PIN = '123456';

export type Profile = {
  id: string;
  username: string;
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
