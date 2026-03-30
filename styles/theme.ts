import { Platform, StyleSheet, TextStyle } from 'react-native';

export const fonts = {
  aladin: { fontFamily: 'Aladin_400Regular' },
};

export const colors = {
  primary: '#2f2f2f',
  secondary: '#7d7d7d',
  white: '#FFF',
  black: '#000',
  gray100: '#f2f2f2',
  gray200: '#e6e8e7',
  gray300: '#cccccc',
  gray400: '#a5a5a5',
  gray500: '#7d7d7d',
  gray600: '#5b5b5b',
  gray700: '#2f2f2f',

  blackSheer95: 'rgba(0, 0, 0, 0.95)',
  blackSheer85: 'rgba(0, 0, 0, 0.85)',
  blackSheer80: 'rgba(0, 0, 0, 0.80)',
  blackSheer75: 'rgba(0, 0, 0, 0.75)',
  blackSheer65: 'rgba(0, 0, 0, 0.65)',
  blackSheer55: 'rgba(0, 0, 0, 0.55)',
  blackSheer45: 'rgba(0, 0, 0, 0.45)',
  blackSheer35: 'rgba(0, 0, 0, 0.35)',
  blackSheer25: 'rgba(0, 0, 0, 0.25)',
  blackSheer15: 'rgba(0, 0, 0, 0.15)',

  greenLight: '#79988C', // #79988C
  greenMedium: '#40725E', // #40725E
  greenDark: '#2B624D', // #2B624D
  greenDark90: '#2B624D90', // #2B624D80

  chocolate: '#5F484F', // chocolate #5F484F (sow)
  teal: '#4B927A', // teal #4B927A (harvest)
  blue: '#669BBC', // blue #669BBC (custom)
  amethyst: '#AD6FB3', // amethyst #AD6FB3 (prune)
  tangerine: '#FAA26B', // tangerine #FAA26B (transplant)
  coral: '#D57373', // coral #D57373 (fertilize)
  dusk: '#445A9C', // dusk #445A9C
  pink: '#F4608C', // pink #F4608C
  peach: '#f79d65', // peach #f79d65
  red: '#D65564', // red #D65564
  lavender: '#6D5379', // lavender #6D5379
  grapefruit: '#FB7A78', // grapefruit #FB7A78
  grape: '#584778', // grape #584778
  yellow: '#F3C51F', // yellow2 #fcdc5d
};

export const seedTypeColorMap = {
  Vegetable: colors.teal,
  Flower: colors.peach,
  Fruit: colors.pink,
  Herb: colors.lavender,
};

export const heading = StyleSheet.create({
  xsmall: {
    color: colors.gray700,
    fontSize: 15,
    fontWeight: 'bold',
  },
  small: {
    color: colors.gray700,
    fontSize: 16,
    fontWeight: 'bold',
  },
  medium: {
    color: colors.gray700,
    fontSize: 18,
    fontWeight: 'bold',
  },
  large: {
    color: colors.gray700,
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export const headingSizeMap = {
  xsmall: heading.xsmall,
  small: heading.small,
  medium: heading.medium,
  large: heading.large,
};

export const text = StyleSheet.create({
  uppercase: { textTransform: 'uppercase' } satisfies TextStyle,
  italic: { fontStyle: 'italic' } satisfies TextStyle,
  mediumBold: { fontWeight: '500' } satisfies TextStyle,
  semibold: { fontWeight: '600' } satisfies TextStyle,
  bold: { fontWeight: '700' } satisfies TextStyle,
  small: { fontSize: 14 } satisfies TextStyle,
  medium: { fontSize: 16 } satisfies TextStyle,
  large: { fontSize: 20 } satisfies TextStyle,
});

export const inputStyles = StyleSheet.create({
  inputsWrapper: {
    gap: 18,
    marginTop: 8,
  },
  inputSection: {},
});

export const shadowStyles = StyleSheet.create({
  shadowOnLightBg: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  shadowOnDarkBg: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.75,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
});

export const appStyles = StyleSheet.create({
  screenPadding: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 22,
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
});
