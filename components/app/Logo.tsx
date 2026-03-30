import { View, Text, StyleSheet } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { colors } from '../../styles/theme';

// Logo.tsx: Logo component for the app

type LogoProps = {
  readonly size: 'small' | 'medium' | 'large';
  readonly showText?: boolean;
};

export default function Logo({ size = 'medium', showText = true }: LogoProps) {
  const logoIconContainerSize = {
    height: LOGO_CONTAINER_SIZE_MAP[size],
    width: LOGO_CONTAINER_SIZE_MAP[size],
  };
  const logoIconSize = LOGO_ICON_SIZE_MAP[size];
  const logoTextSize = LOGO_TEXT_SIZE_MAP[size];
  const logoTextMarginTop = LOGO_TEXT_MARGIN_TOP_MAP[size];

  return (
    <View style={styles.logoContainer}>
      <View style={[styles.logoIconContainer, logoIconContainerSize]}>
        <FontAwesome6 name="seedling" size={logoIconSize} color={colors.white} />
      </View>
      {showText && <Text style={[styles.logoText, { fontSize: logoTextSize, marginTop: logoTextMarginTop }]}>Sproutly</Text>}
    </View>
  );
}

// ---- CONSTANTS ----
const LOGO_CONTAINER_SIZE_MAP = {
  small: 44,
  medium: 76,
  large: 132,
};

const LOGO_ICON_SIZE_MAP = {
  small: 22,
  medium: 44,
  large: 76,
};

const LOGO_TEXT_SIZE_MAP = {
  small: 16,
  medium: 28,
  large: 32,
};

const LOGO_TEXT_MARGIN_TOP_MAP = {
  small: 8,
  medium: 12,
  large: 16,
};

// ---- STYLES ----
const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
  logoIconContainer: {
    alignItems: 'center',
    backgroundColor: colors.greenDark,
    borderRadius: 100,
    justifyContent: 'center',
    paddingTop: 4,
  },
  logoText: {
    color: colors.greenDark,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
