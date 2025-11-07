// TMDB API Service
const TMDB_API_KEY = 'bd57ab9462a56ca0e3d29516559ed424'; // This is a public API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  release_date: string;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
}

export interface MovieDetails extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  homepage: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface MovieCredits {
  cast: Cast[];
  crew: any[];
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const fetchFromTMDB = async (endpoint: string, params: Record<string, string> = {}) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }
  return response.json();
};

export const tmdbService = {
  // Get trending movies
  getTrending: async (timeWindow: 'day' | 'week' = 'week'): Promise<MoviesResponse> => {
    return fetchFromTMDB(`/trending/movie/${timeWindow}`);
  },

  // Get popular movies
  getPopular: async (page: number = 1): Promise<MoviesResponse> => {
    return fetchFromTMDB('/movie/popular', { page: page.toString() });
  },

  // Get top rated movies
  getTopRated: async (page: number = 1): Promise<MoviesResponse> => {
    return fetchFromTMDB('/movie/top_rated', { page: page.toString() });
  },

  // Get now playing movies
  getNowPlaying: async (page: number = 1): Promise<MoviesResponse> => {
    return fetchFromTMDB('/movie/now_playing', { page: page.toString() });
  },

  // Get upcoming movies
  getUpcoming: async (page: number = 1): Promise<MoviesResponse> => {
    return fetchFromTMDB('/movie/upcoming', { page: page.toString() });
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1): Promise<MoviesResponse> => {
    return fetchFromTMDB('/search/movie', { query, page: page.toString() });
  },

  // Get movie details
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    return fetchFromTMDB(`/movie/${movieId}`);
  },

  // Get movie credits
  getMovieCredits: async (movieId: number): Promise<MovieCredits> => {
    return fetchFromTMDB(`/movie/${movieId}/credits`);
  },

  // Get genres
  getGenres: async (): Promise<{ genres: Genre[] }> => {
    return fetchFromTMDB('/genre/movie/list');
  },

  // Get movies by genre
  getMoviesByGenre: async (genreId: number, page: number = 1): Promise<MoviesResponse> => {
    return fetchFromTMDB('/discover/movie', {
      with_genres: genreId.toString(),
      page: page.toString(),
      sort_by: 'popularity.desc',
    });
  },

  // Get all movies sorted by release date
  getMoviesByReleaseDate: async (page: number = 1): Promise<MoviesResponse> => {
    return fetchFromTMDB('/discover/movie', {
      page: page.toString(),
      sort_by: 'release_date.desc',
      'release_date.lte': new Date().toISOString().split('T')[0], // Only released movies
    });
  },

  // Image URL helpers
  getImageUrl: (path: string | null, size: 'w500' | 'w780' | 'original' = 'w500'): string => {
    if (!path) return '/placeholder.svg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },

  getPosterUrl: (path: string | null): string => {
    return tmdbService.getImageUrl(path, 'w500');
  },

  getBackdropUrl: (path: string | null): string => {
    return tmdbService.getImageUrl(path, 'original');
  },
};
