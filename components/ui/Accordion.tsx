import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { List } from 'react-native-paper';
import { colors } from '../../styles/theme';

type AccordionProps = {
  readonly title: string;
  readonly description?: string;
  readonly children?: React.ReactNode;
  readonly openByDefault?: boolean;
};

// Accordion.tsx: Renders an accordion with a title, optional description, and children.
export default function Accordion({ title, description, children, openByDefault = false }: AccordionProps) {
  const [expanded, setExpanded] = useState(openByDefault);

  const hasDescription = description !== undefined && description !== null && description.trim() !== '';

  const color = colors.white;
  const contentStyles = { gap: hasDescription ? 2 : 0 };
  const descriptionText = hasDescription ? description : '';
  const childrenBackgroundColor = colors.screenColor;

  // Open or close the accordion
  const handlePress = () => setExpanded(!expanded);

  return (
    <List.Accordion
      style={[styles.accordionContainer, { backgroundColor: color }]}
      contentStyle={contentStyles}
      rippleColor="transparent"
      expanded={expanded}
      accessibilityLabel={title}
      title={title}
      titleStyle={styles.title}
      description={descriptionText}
      descriptionStyle={styles.description}
      onPress={handlePress}>
      <View style={[styles.childrenContainer, { backgroundColor: childrenBackgroundColor }]}>{children}</View>
    </List.Accordion>
  );
}

// ---- REFERENCES ----
// https://oss.callstack.com/react-native-paper/docs/components/List/ListAccordion

// ---- STYLES ----
const styles = StyleSheet.create({
  accordionContainer: {
    backgroundColor: colors.alabaster,
    borderColor: colors.lightGray,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  title: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    color: colors.secondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  childrenContainer: {
    padding: 16,
  },
});
