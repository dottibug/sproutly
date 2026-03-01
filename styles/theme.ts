import { StyleSheet } from 'react-native';

export type Color = 'primary' | 'secondary';

export const colors = {
  primary: '#000',
  secondary: '#666',
  white: '#FFF',
  gray: '#666',
  hunterGreen: '#38684C', // #38684C
  blue: '#669BBC', // blue #669BBC
  teal: '#4B927A', // teal #4B927A
  pink: '#DE86BF', // pink #DE86BF
  red: '#D65564', // red #D65564
  lavender: '#6D5379', // lavender #6D5379
};

export const typography = StyleSheet.create({
  textSmall: {
    fontSize: 14,
  },
  textMedium: {
    fontSize: 16,
  },
  textLarge: {
    fontSize: 20,
  },
});

const SMALL_SPACING = 8;
const MEDIUM_SPACING = 16;
const LARGE_SPACING = 24;

export const appStyles = StyleSheet.create({
  resultsList: {
    flex: 1,
    gap: 16,
  },
});
