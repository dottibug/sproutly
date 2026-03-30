import { View, Text, StyleSheet } from 'react-native';
import { colors, text } from '../../styles/theme';

// InfoModalListItem.tsx: Used to display a list item in InfoModal.tsx

type InfoModalListItemProps = {
  readonly subheading: string;
  readonly text: string;
};

export default function InfoModalListItem({ subheading, text }: InfoModalListItemProps) {
  return (
    <View style={styles.listItem}>
      <Text style={styles.listItemSubheading}>{subheading}</Text>
      <Text style={styles.listItemText}>{text}</Text>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  listItem: {
    width: '100%',
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  listItemSubheading: {
    fontSize: 16,
    fontWeight: text.semibold.fontWeight,
    color: colors.white,
    backgroundColor: colors.greenLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    textAlign: 'center',
  },
  listItemText: {
    paddingHorizontal: 8,
    fontSize: 16,
    color: colors.gray700,
    textAlign: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
});
