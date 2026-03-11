import { View, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { colors } from '../../styles/theme';

// TODO: stlying
type SearchBarProps = {
  readonly placeholder: string;
  readonly searchQuery: string;
  readonly handleSearchQuery: (query: string) => void;
};

// Renders a search bar with a heading and text input. Must pass in the search query and a function to update the search query as props.
export default function SearchBar({ placeholder, searchQuery, handleSearchQuery }: SearchBarProps) {
  console.log('searchQuery', searchQuery);

  return (
    <View style={styles.searchBarContainer}>
      <Searchbar value={searchQuery} onChangeText={handleSearchQuery} placeholder={placeholder} placeholderTextColor={colors.mediumGray} />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    paddingHorizontal: 16,
    marginVertical: 12,
  },
});
