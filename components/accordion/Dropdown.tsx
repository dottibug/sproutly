import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { List } from 'react-native-paper';
import { colors } from '../../styles/theme';

type DropdownProps = {
  readonly title: string;
  readonly children?: React.ReactNode;
  readonly content?: string;
  readonly openByDefault?: boolean;
  readonly onExpand?: () => void;
};

export default function Dropdown({ title, children, content, openByDefault = false, onExpand }: DropdownProps) {
  const [expanded, setExpanded] = useState(openByDefault);

  const handlePress = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (newExpanded && onExpand) onExpand();
  };

  return (
    <List.Accordion
      title={title}
      titleStyle={styles.dropdownTitle}
      style={styles.dropdownContainer}
      onPress={handlePress}
      expanded={expanded}
      right={() => null}>
      <View style={styles.dropdownContent}>{children}</View>
    </List.Accordion>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    backgroundColor: '#f5f5f5',
    paddingTop: 18,
    paddingBottom: 9,
  },
  dropdownTitle: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  dropdownContent: {
    backgroundColor: '#f5f5f5',
    // paddingHorizontal: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#ccc',
    // borderColor: '#f5f5f5',
  },
});
