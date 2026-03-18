import { transformMovies } from '../movies';
import { Movie, OriginalLanguage } from '@interfaces/index';

jest.mock('react-native-config', () => ({
  BASE_URL_TMDB_IMAGE: 'https://image.tmdb.org/t/p/w500',
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

describe('transformMovies', () => {
  it('should prepend base URL to poster_path', () => {
    const movies = [createMockMovie({ poster_path: '/poster.jpg' })];
    const result = transformMovies(movies);
    expect(result[0].poster_path).toBe(
      'https://image.tmdb.org/t/p/w500/poster.jpg',
    );
  });

  it('should set poster_path to null when it is null', () => {
    const movies = [createMockMovie({ poster_path: null })];
    const result = transformMovies(movies);
    expect(result[0].poster_path).toBeNull();
  });

  it('should handle multiple movies', () => {
    const movies = [
      createMockMovie({ id: 1, poster_path: '/movie1.jpg' }),
      createMockMovie({ id: 2, poster_path: '/movie2.jpg' }),
      createMockMovie({ id: 3, poster_path: null }),
    ];
    const result = transformMovies(movies);
    expect(result[0].poster_path).toBe(
      'https://image.tmdb.org/t/p/w500/movie1.jpg',
    );
    expect(result[1].poster_path).toBe(
      'https://image.tmdb.org/t/p/w500/movie2.jpg',
    );
    expect(result[2].poster_path).toBeNull();
  });

  it('should return an empty array for empty input', () => {
    const result = transformMovies([]);
    expect(result).toEqual([]);
  });

  it('should preserve all other movie properties', () => {
    const movies = [
      createMockMovie({
        id: 5,
        title: 'Preserved Movie',
        vote_average: 9.0,
        poster_path: '/test.jpg',
      }),
    ];
    const result = transformMovies(movies);
    expect(result[0].id).toBe(5);
    expect(result[0].title).toBe('Preserved Movie');
    expect(result[0].vote_average).toBe(9.0);
  });
});
