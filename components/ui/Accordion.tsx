import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { colors, typography } from '../../styles/theme';

type AccordionProps = {
  readonly title: string;
  readonly description?: string;
  readonly children?: React.ReactNode;
  readonly content?: string | null;
  readonly openByDefault?: boolean;
};

// Accordion component that can be opened and closed
export default function Accordion({ title, description, children, content, openByDefault = false }: AccordionProps) {
  const [expanded, setExpanded] = useState(openByDefault);

  const hasDescription = description !== undefined && description !== null && description.trim() !== '';

  const handlePress = () => setExpanded(!expanded);

  return (
    <List.Accordion
      // containerStyle={{ backgroundColor: colors.white }}
      contentStyle={{ gap: hasDescription ? 2 : 0, backgroundColor: colors.white }}
      title={title}
      titleStyle={styles.title}
      description={hasDescription ? description : ''}
      descriptionStyle={styles.description}
      style={styles.accordionContainer}
      onPress={handlePress}
      expanded={expanded}>
      <View style={styles.content}>
        {content && <Text style={typography.textMedium}>{content}</Text>}
        {children}
      </View>
    </List.Accordion>
  );
}

const styles = StyleSheet.create({
  accordionContainer: {
    // backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: '#ccc',
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
  content: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    gap: 16,
  },
});
