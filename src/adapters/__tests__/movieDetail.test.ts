import { transformMoviesDetails } from '../movieDetail';
import { IMovieFull } from '@interfaces/index';

jest.mock('react-native-format-currency', () => ({
  formatCurrency: jest.fn(({ amount }: { amount: number; code: string }) => {
    const formatted = amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
    });
    return [`$${formatted}`, formatted, '$'];
  }),
}));

const createMockMovieFull = (
  overrides: Partial<IMovieFull> = {},
): IMovieFull => ({
  adult: false,
  backdrop_path: null,
  belongs_to_collection: null,
  budget: 120000000,
  genres: [{ id: 28, name: 'Action' }],
  homepage: 'https://example.com',
  id: 1,
  imdb_id: 'tt1234567',
  original_language: 'en',
  original_title: 'Test Movie',
  overview: 'A test movie',
  popularity: 100,
  poster_path: '/poster.jpg',
  production_companies: [],
  production_countries: [],
  release_date: '2024-01-01',
  revenue: 500000000,
  runtime: 120,
  spoken_languages: [],
  status: 'Released',
  tagline: 'A tagline',
  title: 'Test Movie',
  video: false,
  vote_average: 7.5,
  vote_count: 1000,
  ...overrides,
});

describe('transformMoviesDetails', () => {
  it('should format budget with currency symbol', () => {
    const movie = createMockMovieFull({ budget: 120000000 });
    const result = transformMoviesDetails(movie);
    expect(result.budget).toContain('$');
    expect(typeof result.budget).toBe('string');
  });

  it('should return fallback message when budget is 0', () => {
    const movie = createMockMovieFull({ budget: 0 });
    const result = transformMoviesDetails(movie);
    expect(result.budget).toBe('Pelicula sin informacion de Presupuesto');
  });

  it('should preserve all other movie properties', () => {
    const movie = createMockMovieFull({
      id: 42,
      title: 'Preserved',
      overview: 'Keep this',
      budget: 50000000,
    });
    const result = transformMoviesDetails(movie);
    expect(result.id).toBe(42);
    expect(result.title).toBe('Preserved');
    expect(result.overview).toBe('Keep this');
  });

  it('should handle a large budget value', () => {
    const movie = createMockMovieFull({ budget: 999999999 });
    const result = transformMoviesDetails(movie);
    expect(result.budget).toContain('$');
    expect(result.budget).not.toBe('Pelicula sin informacion de Presupuesto');
  });

  it('should handle a small budget value', () => {
    const movie = createMockMovieFull({ budget: 1000 });
    const result = transformMoviesDetails(movie);
    expect(result.budget).toContain('$');
  });
});
