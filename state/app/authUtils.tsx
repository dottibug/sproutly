// ---- AUTH UTILS ----
export const AUTH_FAKE_EMAIL_DOMAIN = 'sproutly.com';
export const UNIVERSAL_PIN = '123456';

export function getAuthEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${AUTH_FAKE_EMAIL_DOMAIN}`;
}
