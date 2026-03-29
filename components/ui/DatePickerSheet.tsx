import { View, StyleSheet, Pressable, Text, Platform, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../../state/app/dateUtils';
import Ionicons from '@expo/vector-icons/Ionicons';
import Heading from './Heading';
import { colors } from '../../styles/theme';

type DatePickerSheetProps = {
  readonly showDatePicker: boolean;
  readonly setShowDatePicker: (show: boolean) => void;
  readonly taskDate: Date;
  readonly setTaskDate: (dateISO: string) => void;
  readonly dateMinimum: Date | undefined;
};

// DatePickerSheet.tsx: Displays a bottom sheet with a date picker
export default function DatePickerSheet({ showDatePicker, setShowDatePicker, taskDate, setTaskDate, dateMinimum }: DatePickerSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.inputSection}>
      <Heading size="xsmall">Date</Heading>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Choose task date"
        style={styles.dateInputRow}
        onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateInputText}>{formatDate(taskDate)}</Text>
        <Ionicons name="calendar-outline" size={22} color={colors.gray500} />
      </Pressable>

      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={taskDate}
          mode="date"
          display="default"
          minimumDate={dateMinimum}
          accentColor={colors.greenMedium}
          onChange={(_, selected) => {
            setShowDatePicker(false);
            if (selected) setTaskDate(selected.toISOString());
          }}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal visible={showDatePicker} transparent animationType="fade" onRequestClose={() => setShowDatePicker(false)}>
          <View style={styles.pickerBackdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowDatePicker(false)} accessibilityLabel="Dismiss date picker" />
            <View style={[styles.pickerSheet, { paddingBottom: Math.max(16, insets.bottom) }]}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Choose date</Text>
                <Pressable onPress={() => setShowDatePicker(false)} hitSlop={12}>
                  <Text style={styles.headerButton}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={taskDate}
                mode="date"
                display="inline"
                minimumDate={dateMinimum}
                accentColor={colors.greenMedium}
                themeVariant="light"
                onChange={(_, selected) => {
                  if (selected) setTaskDate(selected.toISOString());
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  inputSection: {
    gap: 8,
    marginTop: 2,
  },
  dateInputRow: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.blackSheer45,
    borderRadius: 9,
    borderWidth: 1,
    flexDirection: 'row',
    fontSize: 16,
    gap: 8,
    justifyContent: 'space-between',
    padding: 12,
  },
  dateInputText: {
    color: colors.blackSheer55,
    flex: 1,
    fontSize: 16,
  },
  pickerBackdrop: {
    backgroundColor: colors.blackSheer55,
    flex: 1,
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '75%',
    paddingHorizontal: 32,
    paddingTop: 12,
  },
  pickerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 44,
    paddingHorizontal: 12,
  },
  pickerTitle: {
    color: colors.secondary,
    fontSize: 18,
    fontWeight: '600',
  },
  headerButton: {
    color: colors.greenMedium,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});

// ---- REFERENCES ----
// https://github.com/react-native-datetimepicker/datetimepicker
