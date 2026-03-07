import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { colors, typography } from '../../styles/theme';

type AccordionProps = {
  readonly title: string;
  readonly children?: React.ReactNode;
  readonly content: string;
  readonly openByDefault?: boolean;
};

export default function Accordion({ title, children, content, openByDefault = false }: AccordionProps) {
  const [expanded, setExpanded] = useState(openByDefault);

  const handlePress = () => setExpanded(!expanded);

  return (
    <List.Accordion
      title={title}
      titleStyle={styles.accordionTitle}
      style={styles.accordionContainer}
      onPress={handlePress}
      expanded={expanded}>
      <View style={styles.accordionContent}>
        <Text style={typography.textMedium}>{content}</Text>
        {children}
      </View>
    </List.Accordion>
  );
}

const styles = StyleSheet.create({
  accordionContainer: {
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  accordionTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  accordionContent: {
    flexDirection: 'column',
    gap: 16,
    padding: 16,
  },
});
