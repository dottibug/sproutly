import { View, StyleSheet } from 'react-native';
import { Searchbar as PaperSearchbar } from 'react-native-paper';
import { colors } from '../../styles/theme';

// SearchBar.tsx: A search bar component with a placeholder and a search query input. Must pass in the placeholder text, the search query, and a function to update the search query. Can be autofocused.

type SearchBarProps = {
  readonly searchQuery: string;
  readonly handleSearchQuery: (query: string) => void;
  readonly autofocus?: boolean;
};

export default function SearchBar({ searchQuery, handleSearchQuery, autofocus = false }: SearchBarProps) {
  return (
    <View style={styles.searchBarContainer}>
      <PaperSearchbar
        value={searchQuery}
        onChangeText={handleSearchQuery}
        placeholder="Search seeds"
        placeholderTextColor={colors.gray500}
        autoFocus={autofocus}
        searchAccessibilityLabel="Search seeds"
        inputStyle={styles.searchBarInput}
        style={styles.searchBar}
      />
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  searchBarContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  searchBar: {
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    maxHeight: 48,
  },
  searchBarInput: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.gray700,
    minHeight: 48,
    maxHeight: 48,
  },
});
