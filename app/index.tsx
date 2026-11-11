import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { searchMovies, MovieItem } from '../api/omdb';
import { COLORS } from '../constants/theme';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<MovieItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const router = useRouter();

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setPage(1);
    const data = await searchMovies(query, 1);
    setMovies(data.Search || []);
    setTotalResults(parseInt(data.totalResults, 10) || 0);
    setLoading(false);
  };

  const loadMore = async () => {
    if (movies.length >= totalResults || loading) return;
    const nextPage = page + 1;
    const data = await searchMovies(query, nextPage);
    if (data.Search) {
      setMovies((prev) => [...prev, ...data.Search]);
      setPage(nextPage);
    }
  };

  const renderMovieItem = ({ item }: { item: MovieItem }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
     onPress={() => router.push(`/movie/${item.imdbID}` as any)}
    >
      <Image
        source={{
          uri: item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/300x450?text=No+Poster',
        }}
        style={styles.poster}
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.Title}
        </Text>
        <Text style={styles.cardSubtitle}>
          {item.Year} • {item.Type.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>FILM BROWSER</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="SEARCH MOVIES..."
          placeholderTextColor={COLORS.textSecondary}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>FIND</Text>
        </TouchableOpacity>
      </View>

      {loading && page === 1 ? (
        <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item, index) => `${item.imdbID}-${index}`}
          renderItem={renderMovieItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={
            loading && page > 1 ? <ActivityIndicator size="small" color={COLORS.accent} /> : undefined
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchButton: {
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: 220,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.cardText,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#A0A0A0',
  },
});