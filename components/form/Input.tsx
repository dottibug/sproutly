import { View, TextInput, Text, StyleSheet } from 'react-native';
import Heading from '../ui/Heading';
import Foundation from '@expo/vector-icons/Foundation';
import { colors } from '../../styles/theme';
import IconButton from '../ui/buttons/IconButton';

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
}: InputProps) {
  const inputStyles = StyleSheet.flatten([styles.input, multiline && styles.inputMultiline, hasError && styles.inputError]);

  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <View style={styles.labelContainerRow}>
          <Heading size="xsmall">{label}</Heading>
          {showInfoIcon && <IconButton icon="info" onPress={onIconPress || (() => {})} />}
          {required && (
            <View style={styles.requiredContainer}>
              <Foundation name="asterisk" size={12} color={colors.secondary} />
              <Text style={styles.requiredText}>Required</Text>
            </View>
          )}
        </View>
      </View>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        inputMode={inputMode}
        style={inputStyles}
      />
      {hasError && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    gap: 8,
  },
  labelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelContainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    width: '100%',
  },
  requiredContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  requiredText: {
    color: colors.secondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 9,
    fontSize: 16,
    padding: 12,
  },
  inputMultiline: {
    height: 120,
    maxHeight: 120,
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    fontSize: 14,
    fontStyle: 'italic',
  },
});
