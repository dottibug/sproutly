import { View, TextInput, Text, StyleSheet, Platform } from 'react-native';
import { useState } from 'react';
import Foundation from '@expo/vector-icons/Foundation';
import Heading from '../Heading';
import IconButton from '../buttons/IconButton';
import { colors, shadowStyles } from '../../../styles/theme';

/**
 * Input.tsx: A reusable input component for the app. Used in various screens and components. Features include:
 * - Heading (sizes: xsmall, small, medium, large)
 * - Placeholder text
 * - Focus state/styling
 * - Required label
 * - Optional note (e.g. 'Must be a number')
 * - Optional info icon (e.g. for tooltip)
 * - Mark as secure text entry
 * - Disabled state/styling
 * - Error state/styling
 * - Input modes: text, numeric, email
 * - Mark as multiline
 * - Mark whether the input is editable or read-only
 */

type InputProps = {
  readonly required?: boolean;
  readonly label: string;
  readonly placeholder: string;
  readonly value: string;
  readonly onChangeText: (text: string) => void;
  readonly multiline?: boolean;
  readonly inputMode?: 'text' | 'numeric' | 'email';
  readonly hasError?: boolean;
  readonly errorMessage?: string;
  readonly showInfoIcon?: boolean;
  readonly onIconPress?: () => void;
  readonly secureTextEntry?: boolean;
  readonly editable?: boolean;
  readonly disabled?: boolean;
  readonly headingSize?: 'xsmall' | 'small' | 'medium' | 'large';
  readonly note?: string;
};

export default function Input({
  required = false,
  label,
  placeholder = 'Enter text',
  value,
  onChangeText,
  multiline = false,
  inputMode = 'text',
  hasError = false,
  errorMessage = 'Invalid input',
  showInfoIcon = false,
  onIconPress,
  secureTextEntry = false,
  editable = true,
  disabled = false,
  headingSize = 'xsmall',
  note = '',
}: InputProps) {
  const [focused, setFocused] = useState(false);

  const headingCustomStyles = disabled ? { color: colors.gray500, opacity: 0.78 } : {};

  const placeholderColor = disabled ? colors.gray300 : colors.gray400;

  const inputStyles = StyleSheet.flatten([
    styles.input,
    multiline && styles.inputMultiline,
    hasError && styles.inputError,
    !editable && styles.inputReadOnly,
    disabled && styles.inputDisabled,
    focused && shadowStyles.shadowOnLightBg && styles.inputFocused,
  ]);

  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <View style={styles.labelContainerRow}>
          {showInfoIcon && <IconButton icon="info" size={22} color={colors.dusk} onPress={onIconPress || (() => {})} />}
          <Heading size={headingSize} customStyles={headingCustomStyles}>
            {label}
          </Heading>
          {(required || Boolean(note)) && (
            <View style={styles.requiredContainer}>
              <Foundation name="asterisk" size={12} color={colors.secondary} />
              <Text style={styles.requiredText}>{required ? 'Required' : note}</Text>
            </View>
          )}
        </View>
      </View>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        inputMode={inputMode}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={inputStyles}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry={secureTextEntry}
        editable={editable}
        selectionColor={colors.greenMedium}
        cursorColor={colors.greenMedium}
      />
      {hasError && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  inputContainer: {
    gap: 10,
  },
  labelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  requiredContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  requiredText: {
    color: colors.secondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: 0,
    fontSize: 16,
    padding: 12,
  },
  inputMultiline: {
    height: 120,
    maxHeight: 120,
    paddingTop: 12,
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    fontSize: 14,
    fontStyle: 'italic',
  },
  inputReadOnly: {},
  inputDisabled: {
    opacity: 0.85,
    backgroundColor: colors.gray200,
    borderColor: colors.gray200,
  },
  inputFocused: {
    borderColor: colors.greenMedium,
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
});
