// TMDB API Service (Vite + Environment Variables)
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;

if (!TMDB_API_KEY) {
  throw new Error(
    'VITE_TMDB_API_KEY is not defined. Please add it to your .env file.'
  );
}

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
  crew: any[]; // You can type this better if needed
}

export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface VideosResponse {
  id: number;
  results: Video[];
}

const fetchFromTMDB = async <T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', TMDB_API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
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

  // Get all movies sorted by release date (released only)
  getMoviesByReleaseDate: async (page: number = 1): Promise<MoviesResponse> => {
    return fetchFromTMDB('/discover/movie', {
      page: page.toString(),
      sort_by: 'release_date.desc',
      'release_date.lte': new Date().toISOString().split('T')[0],
    });
  },

  // Get YouTube trailer key for a movie
  getTrailerKey: async (movieId: number): Promise<string | null> => {
    try {
      const data: VideosResponse = await fetchFromTMDB(`/movie/${movieId}/videos`);

      const youtubeVideos = data.results.filter((v) => v.site === 'YouTube');

      // 1. Official Trailer or Teaser
      const officialTrailer = youtubeVideos.find(
        (v) => v.official && (v.type === 'Trailer' || v.type === 'Teaser')
      );
      if (officialTrailer) return officialTrailer.key;

      // 2. Any Trailer or Teaser
      const anyTrailer = youtubeVideos.find((v) => v.type === 'Trailer' || v.type === 'Teaser');
      if (anyTrailer) return anyTrailer.key;

      // 3. Any YouTube video
      const anyVideo = youtubeVideos[0];
      if (anyVideo) return anyVideo.key;

      return null;
    } catch (error) {
      console.warn(`[TMDB] Failed to fetch trailer for movie ${movieId}:`, error);
      return null;
    }
  },

  // Image URL helpers
  getImageUrl: (
    path: string | null,
    size: 'w300' | 'w500' | 'w780' | 'w1280' | 'original' = 'w500'
  ): string => {
    if (!path) return '/placeholder.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  },

  getPosterUrl: (path: string | null): string => {
    return tmdbService.getImageUrl(path, 'w500');
  },

  getBackdropUrl: (path: string | null): string => {
    return tmdbService.getImageUrl(path, 'original');
  },
};