import { Platform, StyleSheet, TextStyle } from 'react-native';

export const fonts = {
  aladin: { fontFamily: 'Aladin_400Regular' },
};

export const colors = {
  primary: '#2f2f2f',
  secondary: '#7d7d7d',
  white: '#FFF',
  gray100: '#f2f2f2',
  gray200: '#e6e8e7',
  gray300: '#cccccc',
  gray400: '#a5a5a5',
  gray500: '#7d7d7d',
  gray600: '#5b5b5b',
  gray700: '#2f2f2f',
  blackSheer80: 'rgba(0, 0, 0, 0.80)',
  blackSheer75: 'rgba(0, 0, 0, 0.75)',
  blackSheer65: 'rgba(0, 0, 0, 0.65)',
  blackSheer55: 'rgba(0, 0, 0, 0.55)',
  blackSheer45: 'rgba(0, 0, 0, 0.45)',
  blackSheer15: 'rgba(0, 0, 0, 0.15)',
  greenLight: '#79988C',
  greenMedium: '#40725E',
  greenDark: '#2B624D',
  greenDark90: '#2B624D90',
  chocolate: '#5F484F',
  teal: '#4B927A',
  blue: '#669BBC',
  amethyst: '#AD6FB3',
  tangerine: '#FAA26B',
  coral: '#D57373',
  dusk: '#445A9C',
  pink: '#F4608C',
  peach: '#f79d65',
  red: '#D65564',
  lavender: '#6D5379',
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
  semibold: { fontWeight: '600' } satisfies TextStyle,
  bold: { fontWeight: '700' } satisfies TextStyle,
  medium: { fontSize: 16 } satisfies TextStyle,
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
        shadowRadius: 9,
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
});
