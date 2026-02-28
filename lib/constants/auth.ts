// Constants for authentication. For demo purposes, a fake email and universal pin are used for authentication.

export const AUTH_FAKE_EMAIL_DOMAIN = 'sproutly.com';

export function getAuthEmail(username: string): string {
  return `${username.trim().toLowerCase()}@${AUTH_FAKE_EMAIL_DOMAIN}`;
}

export const UNIVERSAL_PIN = '123456';
