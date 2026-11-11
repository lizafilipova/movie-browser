import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getMovieDetails, MovieDetails } from '../../api/omdb';
import { COLORS } from '../../constants/theme';

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getMovieDetails(id as string).then((data) => {
        setMovie(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.centered}>
        <Text>Фільм не знайдено</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← BACK</Text>
      </TouchableOpacity>

      <Image
        source={{
          uri: movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450',
        }}
        style={styles.poster}
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{movie.Title}</Text>
        <Text style={styles.meta}>
          {movie.Year} • {movie.Genre} • {movie.Runtime}
        </Text>

        <View style={styles.ratingBox}>
          <Text style={styles.ratingText}>★ {movie.imdbRating} / 10</Text>
        </View>

        <Text style={styles.sectionHeader}>PLOT</Text>
        <Text style={styles.plot}>{movie.Plot}</Text>

        <Text style={styles.sectionHeader}>DIRECTOR</Text>
        <Text style={styles.infoText}>{movie.Director}</Text>

        <Text style={styles.sectionHeader}>CAST</Text>
        <Text style={styles.infoText}>{movie.Actors}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  backButton: {
    marginTop: 50,
    marginLeft: 16,
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  poster: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  ratingBox: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  ratingText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 15,
    marginBottom: 5,
    letterSpacing: 1,
  },
  plot: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textPrimary,
  },
  infoText: {
    fontSize: 15,
    color: COLORS.textPrimary,
  },
});