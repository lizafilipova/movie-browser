const API_KEY = '867233f8'; // <-- Вставити ключ сюди
const BASE_URL = 'https://www.omdbapi.com/';

export interface MovieItem {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}

export interface MovieDetails extends MovieItem {
  Plot: string;
  Genre: string;
  Director: string;
  Actors: string;
  imdbRating: string;
  Runtime: string;
}

export const searchMovies = async (query: string, page: number = 1) => {
  if (!query.trim()) return { Search: [], totalResults: '0' };
  
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`);
  const data = await response.json();
  
  if (data.Response === 'True') {
    return { Search: data.Search, totalResults: data.totalResults };
  }
  return { Search: [], totalResults: '0' };
};

export const getMovieDetails = async (id: string): Promise<MovieDetails | null> => {
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`);
  const data = await response.json();
  
  if (data.Response === 'True') {
    return data;
  }
  return null;
};