import { IconButton, Snackbar as PaperSnackbar } from 'react-native-paper';
import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { colors } from '../../styles/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// TODO: DELETE

type AppSnackbarProps = {
  readonly visible: boolean;
  readonly onDismiss: () => void;
};

// Snackbar.tsx: Displays a snackbar message at the bottom of the screen.
export default function AppSnackbar({ visible, onDismiss }: AppSnackbarProps) {
  return (
    <PaperSnackbar
      duration={Number.POSITIVE_INFINITY}
      visible={visible}
      onDismiss={onDismiss}
      wrapperStyle={styles.snackbarWrapper}
      style={styles.snackbar}
      elevation={5}>
      <View style={styles.snackbarContent}>
        <View style={styles.snackbarButtons}>
          <Pressable style={styles.snackbarTextButton}>
            <FontAwesome6 name="plus" size={12} color={colors.primary} />
            <Text style={styles.snackbarText}>Add Custom Seed</Text>
          </Pressable>
          <Pressable style={styles.snackbarTextButton}>
            <FontAwesome6 name="plus" size={12} color={colors.primary} />
            <Text style={styles.snackbarText}>Browse</Text>
          </Pressable>
        </View>
        <Pressable style={styles.closeButton} onPress={onDismiss}>
          <FontAwesome6 name="xmark" size={24} color="#ffffff99" />
        </Pressable>
      </View>
    </PaperSnackbar>
  );
}

const styles = StyleSheet.create({
  snackbarWrapper: {
    paddingBottom: 0,
    // backgroundColor: 'red',
  },
  snackbar: {
    height: 90,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 0,
    backgroundColor: colors.greenLight,

    // paddingBottom: 0,
    // borderWidth: 1,
    // borderColor: 'blue',
    // position: 'relative',
    // padding: 0,
    // backgroundColor:
    // color: colors.white,
  },
  snackbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    // borderWidth: 1,
    borderColor: 'yellow',
  },
  snackbarButtons: {
    flexDirection: 'row',
    gap: 16,

    // borderWidth: 1,
    borderColor: 'purple',
  },
  snackbarTextButton: {
    alignItems: 'center',
    flexDirection: 'row',
    // borderWidth: 1,
    // borderColor: '#ffffff50',
    // backgroundColor: '#E6E8E799',
    backgroundColor: '#ffffff80',
    gap: 6,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  snackbarText: {
    color: colors.primary,
    fontSize: 15,
    // width: '80%',
  },
  closeButton: {
    // width: 96,
    width: 54,
    // backgroundColor: '#ffffff50',
    height: 54,
    borderRadius: 100,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    borderColor: '#ffffff50',
    // backgroundColor: 'red',
    // position: 'absolute',
    // right: 0,
    // top: 0,
  },
});

// ---- REFERENCES ----
// https://oss.callstack.com/react-native-paper/docs/components/Snackbar
