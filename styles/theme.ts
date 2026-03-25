import { Platform, StyleSheet } from 'react-native';

export type Color = 'primary' | 'secondary';

export const colors = {
  primary: '#2F2F2F', // #2F2F2F
  secondary: '#666',

  hunterGreen: '#2B624D', // #2B624D
  green: '#2B624D', // #2B624D
  greenMedium: '#40725E', // #40725E
  greenLight: '#79988C', // #79988C
  green90: '#2B624D90', // #2B624D80

  /////////// EDITING (colors above fold are keepers)
  // primary: '#000',
  white: '#FFF',
  gray: '#666',
  mediumGray: '#999',
  lightGray: '#ccc',
  blue: '#669BBC', // blue #669BBC
  dusk: '#445A9C', // dusk #445A9C
  teal: '#4B927A', // teal #4B927A
  pink: '#F4608C', // pink #F4608C
  peach: '#f79d65', // peach #f79d65
  red: '#D65564', // red #D65564
  lavender: '#6D5379', // lavender #6D5379
  grapefruit: '#FB7A78', // grapefruit #FB7A78
  amethyst: '#AD6FB3', // amethyst #AD6FB3
  grape: '#584778', // grape #584778
  yellow: '#F3C51F', // yellow2 #fcdc5d
};

export const seedTypeColorMap = {
  Vegetable: colors.teal,
  Flower: colors.peach,
  Fruit: colors.pink,
  Herb: colors.lavender,
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
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
    padding: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.13,
        shadowRadius: 14,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardPressed: {
    opacity: 0.94,
    transform: [{ scale: 0.99 }],
  },

  ///// above fold are finished styles
  resultsList: {
    flex: 1,
    gap: 16,
  },
  modalContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderRadius: 20,
    elevation: 5,
    gap: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    width: '80%',
  },
  customSeedInputSection: {
    gap: 8,
  },
});
