import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { List } from 'react-native-paper';
import { colors, headingSizeMap } from '../../styles/theme';

// Accordion.tsx: Renders an accordion with a title, optional description, and children.

type AccordionProps = {
  readonly title: string;
  readonly description?: string;
  readonly children?: React.ReactNode;
  readonly openByDefault?: boolean;
  readonly titleSize?: 'xsmall' | 'small' | 'medium' | 'large';
};

export default function Accordion({ title, description, children, openByDefault = false, titleSize = 'medium' }: AccordionProps) {
  const [expanded, setExpanded] = useState(openByDefault);
  const hasDescription = description !== undefined && description !== null && description.trim() !== '';
  const color = colors.white;
  const contentStyles = { gap: hasDescription ? 2 : 0 };
  const descriptionText = hasDescription ? description : '';
  const childrenBackgroundColor = colors.gray100;

  const handlePress = () => setExpanded(!expanded);

  const headingStyles = StyleSheet.flatten([headingSizeMap[titleSize], { color: colors.primary }]);

  return (
    <List.Accordion
      style={[styles.accordionContainer, { backgroundColor: color }]}
      contentStyle={contentStyles}
      rippleColor="transparent"
      expanded={expanded}
      accessibilityLabel={title}
      title={title}
      titleStyle={headingStyles}
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
    backgroundColor: colors.gray200,
    borderColor: colors.gray300,
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
    // fontStyle: 'italic',
    marginTop: 3,
  },
  childrenContainer: {
    padding: 16,
  },
});
