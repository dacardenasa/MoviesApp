import {
  Movie,
  OriginalLanguage,
  IMovieFull,
  IMovieCredits,
  Cast,
} from '@interfaces/index';
import { moviesAPI } from '../movies';

const mockGet = jest.fn();
jest.mock('@api/index', () => ({
  api: { get: (...args: any[]) => mockGet(...args) },
}));

jest.mock('react-native-config', () => ({
  BASE_URL_TMDB_IMAGE: 'https://image.tmdb.org/t/p/w500',
}));

jest.mock('react-native-format-currency', () => ({
  formatCurrency: jest.fn(() => ['$1,000,000', '1,000,000', '$']),
}));

const createMockMovie = (overrides: Partial<Movie> = {}): Movie => ({
  adult: false,
  backdrop_path: '/backdrop.jpg',
  genre_ids: [28, 12],
  id: 1,
  original_language: OriginalLanguage.En,
  original_title: 'Test Movie',
  overview: 'A test movie overview',
  popularity: 100,
  poster_path: '/poster.jpg',
  release_date: '2024-01-01',
  title: 'Test Movie',
  video: false,
  vote_average: 7.5,
  vote_count: 1000,
  ...overrides,
});

const createMockMovieFull = (
  overrides: Partial<IMovieFull> = {},
): IMovieFull => ({
  adult: false,
  backdrop_path: null,
  belongs_to_collection: null,
  budget: 1000000,
  genres: [{ id: 28, name: 'Action' }],
  homepage: 'https://movie.com',
  id: 1,
  imdb_id: 'tt1234567',
  original_language: 'en',
  original_title: 'Test Movie',
  overview: 'A test movie overview',
  popularity: 100,
  poster_path: '/poster.jpg',
  production_companies: [],
  production_countries: [],
  release_date: '2024-01-01',
  revenue: 5000000,
  runtime: 120,
  spoken_languages: [],
  status: 'Released',
  tagline: 'A great movie',
  title: 'Test Movie',
  video: false,
  vote_average: 7.5,
  vote_count: 1000,
  ...overrides,
});

const createMockCast = (overrides: Partial<Cast> = {}): Cast => ({
  adult: false,
  gender: 1,
  id: 1,
  known_for_department: 'Acting',
  name: 'Actor Name',
  original_name: 'Actor Name',
  popularity: 50,
  profile_path: '/profile.jpg',
  character: 'Character',
  credit_id: 'abc123',
  order: 0,
  ...overrides,
});

const createMockCredits = (
  overrides: Partial<IMovieCredits> = {},
): IMovieCredits => ({
  id: 1,
  cast: [createMockCast()],
  crew: [createMockCast({ known_for_department: 'Directing' })],
  ...overrides,
});

describe('moviesAPI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNowPlayingMovie', () => {
    it('should fetch now playing movies and transform results', async () => {
      const mockMovies = [createMockMovie(), createMockMovie({ id: 2 })];
      mockGet.mockResolvedValue({
        data: {
          page: 1,
          results: mockMovies,
          total_pages: 1,
          total_results: 2,
        },
      });

      const result = await moviesAPI.getNowPlayingMovie();

      expect(mockGet).toHaveBeenCalledWith('/movie/now_playing');
      expect(result.results).toHaveLength(2);
      expect(result.results[0].poster_path).toBe(
        'https://image.tmdb.org/t/p/w500/poster.jpg',
      );
      expect(result.page).toBe(1);
    });

    it('should throw a descriptive error when the API call fails', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(moviesAPI.getNowPlayingMovie()).rejects.toThrow(
        'Error al obtener las películas en cartelera',
      );
    });
  });

  describe('getPopularMovies', () => {
    it('should fetch popular movies and transform results', async () => {
      const mockMovies = [createMockMovie({ title: 'Popular Movie' })];
      mockGet.mockResolvedValue({
        data: {
          page: 1,
          results: mockMovies,
          total_pages: 1,
          total_results: 1,
        },
      });

      const result = await moviesAPI.getPopularMovies();

      expect(mockGet).toHaveBeenCalledWith('/movie/popular');
      expect(result.results).toHaveLength(1);
      expect(result.results[0].poster_path).toBe(
        'https://image.tmdb.org/t/p/w500/poster.jpg',
      );
    });

    it('should throw a descriptive error when the API call fails', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(moviesAPI.getPopularMovies()).rejects.toThrow(
        'Error al obtener las películas populares',
      );
    });
  });

  describe('getTopRatedMovies', () => {
    it('should fetch top rated movies and transform results', async () => {
      const mockMovies = [createMockMovie({ title: 'Top Rated Movie' })];
      mockGet.mockResolvedValue({
        data: {
          page: 1,
          results: mockMovies,
          total_pages: 1,
          total_results: 1,
        },
      });

      const result = await moviesAPI.getTopRatedMovies();

      expect(mockGet).toHaveBeenCalledWith('/movie/top_rated');
      expect(result.results).toHaveLength(1);
    });

    it('should throw a descriptive error when the API call fails', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(moviesAPI.getTopRatedMovies()).rejects.toThrow(
        'Error al obtener las películas mejor valoradas',
      );
    });
  });

  describe('getUpcomingMovies', () => {
    it('should fetch upcoming movies and transform results', async () => {
      const mockMovies = [createMockMovie({ title: 'Upcoming Movie' })];
      mockGet.mockResolvedValue({
        data: {
          page: 1,
          results: mockMovies,
          total_pages: 1,
          total_results: 1,
        },
      });

      const result = await moviesAPI.getUpcomingMovies();

      expect(mockGet).toHaveBeenCalledWith('/movie/upcoming');
      expect(result.results).toHaveLength(1);
    });

    it('should throw a descriptive error when the API call fails', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(moviesAPI.getUpcomingMovies()).rejects.toThrow(
        'Error al obtener las próximas películas',
      );
    });
  });

  describe('getMovieDetails', () => {
    it('should fetch movie details and transform the budget', async () => {
      const mockMovieFull = createMockMovieFull({ id: 42, budget: 1000000 });
      mockGet.mockResolvedValue({ data: mockMovieFull });

      const result = await moviesAPI.getMovieDetails(42);

      expect(mockGet).toHaveBeenCalledWith('/movie/42');
      expect(result.id).toBe(42);
      expect(result.budget).toBe('$1,000,000');
    });

    it('should handle a movie with zero budget', async () => {
      const mockMovieFull = createMockMovieFull({ budget: 0 });
      mockGet.mockResolvedValue({ data: mockMovieFull });

      const result = await moviesAPI.getMovieDetails(1);

      expect(result.budget).toBe('Pelicula sin informacion de Presupuesto');
    });

    it('should throw a descriptive error when the API call fails', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(moviesAPI.getMovieDetails(42)).rejects.toThrow(
        'Error al obtener los detalles de la película',
      );
    });
  });

  describe('getMovieCredits', () => {
    it('should fetch movie credits and transform cast profile URLs', async () => {
      const mockCredits = createMockCredits({ id: 42 });
      mockGet.mockResolvedValue({ data: mockCredits });

      const result = await moviesAPI.getMovieCredits(42);

      expect(mockGet).toHaveBeenCalledWith('/movie/42/credits');
      expect(result.id).toBe(42);
      expect(result.cast).toBeDefined();
    });

    it('should throw a descriptive error when the API call fails', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(moviesAPI.getMovieCredits(42)).rejects.toThrow(
        'Error al obtener los créditos de la película',
      );
    });
  });

  describe('edge cases', () => {
    it('should handle movies with null poster_path in list endpoints', async () => {
      const mockMovies = [createMockMovie({ poster_path: null })];
      mockGet.mockResolvedValue({
        data: {
          page: 1,
          results: mockMovies,
          total_pages: 1,
          total_results: 1,
        },
      });

      const result = await moviesAPI.getNowPlayingMovie();

      expect(result.results[0].poster_path).toBeNull();
    });

    it('should handle an empty results array', async () => {
      mockGet.mockResolvedValue({
        data: { page: 1, results: [], total_pages: 0, total_results: 0 },
      });

      const result = await moviesAPI.getPopularMovies();

      expect(result.results).toEqual([]);
    });

    it('should handle credits with empty cast array', async () => {
      const mockCredits = createMockCredits({ cast: [], crew: [] });
      mockGet.mockResolvedValue({ data: mockCredits });

      const result = await moviesAPI.getMovieCredits(1);

      expect(result.cast).toEqual([]);
    });

    it('should handle cast members with null profile_path', async () => {
      const mockCredits = createMockCredits({
        cast: [createMockCast({ profile_path: null })],
      });
      mockGet.mockResolvedValue({ data: mockCredits });

      const result = await moviesAPI.getMovieCredits(1);

      expect(result.cast).toHaveLength(1);
    });
  });
});
