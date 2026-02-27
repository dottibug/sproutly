import { View, TextInput, StyleSheet } from 'react-native';
import Heading from './Heading';

const PLACEHOLDER = 'Search seeds…';

type SearchBarProps = {
  readonly searchQuery: string;
  readonly onSearchQueryChange: (query: string) => void;
};

// Renders a search bar with a heading and text input. Must pass in the search query and a function to update the search query as props.
export default function SearchBar({ searchQuery, onSearchQueryChange }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Heading size="small" uppercase>
        Search
      </Heading>
      <TextInput
        style={styles.input}
        placeholder={PLACEHOLDER}
        value={searchQuery}
        onChangeText={onSearchQueryChange}
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    gap: 8,
    paddingBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    marginBottom: 12,
  },
});
