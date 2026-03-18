import { View, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { colors } from '../../styles/theme';

// TODO: stlying
type SearchBarProps = {
  readonly placeholder: string;
  readonly searchQuery: string;
  readonly handleSearchQuery: (query: string) => void;
  readonly autofocus?: boolean;
};

// Search bar component with a placeholder and a search query input. Must pass in the placeholder text, the search query, and a function to update the search query. Can be autofocused.
export default function SearchBar({ placeholder, searchQuery, handleSearchQuery, autofocus = false }: SearchBarProps) {
  return (
    <View style={styles.searchBarContainer}>
      <Searchbar
        value={searchQuery}
        onChangeText={handleSearchQuery}
        placeholder={placeholder}
        placeholderTextColor={colors.mediumGray}
        autoFocus={autofocus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
});
