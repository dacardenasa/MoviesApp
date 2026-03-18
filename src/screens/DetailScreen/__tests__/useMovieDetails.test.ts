import { Cast, IMovieFull } from '@interfaces/index';

const mockGetMovieDetails = jest.fn();
const mockGetMovieCredits = jest.fn();

jest.mock('@services/index', () => ({
  moviesAPI: {
    getMovieDetails: (...args: any[]) => mockGetMovieDetails(...args),
    getMovieCredits: (...args: any[]) => mockGetMovieCredits(...args),
  },
}));

let focusCallback: (() => void) | null = null;

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (cb: () => void) => {
    focusCallback = cb;
  },
}));

const mockSetState = jest.fn();

jest.mock('react', () => {
  const actualReact = jest.requireActual('react');
  return {
    ...actualReact,
    useState: (initial: any) => [initial, mockSetState],
    useCallback: (cb: any) => cb,
  };
});

import { useMovieDetails } from '../useMovieDetails';

const flushPromises = () => new Promise(resolve => setImmediate(resolve));

const createMockMovieFull = (
  overrides: Partial<IMovieFull> = {},
): IMovieFull => ({
  adult: false,
  backdrop_path: null,
  belongs_to_collection: null,
  budget: 1000000,
  genres: [{ id: 28, name: 'Acción' }],
  homepage: 'https://movie.com',
  id: 42,
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

describe('useMovieDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    focusCallback = null;
  });

  it('should initialize with loading state and empty cast', () => {
    const hookResult = useMovieDetails({ movieId: 42 });

    expect(hookResult.isLoading).toBe(true);
    expect(hookResult.movieDetails).toBeUndefined();
    expect(hookResult.cast).toEqual([]);
  });

  it('should call useFocusEffect to fetch data on mount', () => {
    useMovieDetails({ movieId: 42 });

    expect(focusCallback).toBeDefined();
  });

  it('should fetch movie details and credits for the given movieId', async () => {
    const mockDetails = createMockMovieFull({ id: 42 });
    const mockCast = [createMockCast({ id: 1 }), createMockCast({ id: 2 })];

    mockGetMovieDetails.mockResolvedValue(mockDetails);
    mockGetMovieCredits.mockResolvedValue({
      id: 42,
      cast: mockCast,
      crew: [],
    });

    useMovieDetails({ movieId: 42 });
    focusCallback!();
    await flushPromises();

    expect(mockGetMovieDetails).toHaveBeenCalledWith(42);
    expect(mockGetMovieCredits).toHaveBeenCalledWith(42);
  });

  it('should update state with fetched movie details and cast', async () => {
    const mockDetails = createMockMovieFull({ id: 42 });
    const mockCast = [createMockCast({ id: 1, name: 'Jane Doe' })];

    mockGetMovieDetails.mockResolvedValue(mockDetails);
    mockGetMovieCredits.mockResolvedValue({
      id: 42,
      cast: mockCast,
      crew: [],
    });

    useMovieDetails({ movieId: 42 });
    focusCallback!();
    await flushPromises();

    expect(mockSetState).toHaveBeenCalledWith({
      isLoading: false,
      movieDetails: mockDetails,
      cast: mockCast,
    });
  });

  it('should call both APIs in parallel via Promise.all', async () => {
    let detailsResolve: (value: any) => void;
    let creditsResolve: (value: any) => void;

    const detailsPromise = new Promise(resolve => {
      detailsResolve = resolve;
    });
    const creditsPromise = new Promise(resolve => {
      creditsResolve = resolve;
    });

    mockGetMovieDetails.mockReturnValue(detailsPromise);
    mockGetMovieCredits.mockReturnValue(creditsPromise);

    useMovieDetails({ movieId: 99 });
    focusCallback!();

    expect(mockGetMovieDetails).toHaveBeenCalledWith(99);
    expect(mockGetMovieCredits).toHaveBeenCalledWith(99);

    detailsResolve!(createMockMovieFull({ id: 99 }));
    creditsResolve!({ id: 99, cast: [], crew: [] });

    await flushPromises();

    expect(mockSetState).toHaveBeenCalledWith(
      expect.objectContaining({ isLoading: false }),
    );
  });

  it('should pass a different movieId when provided', async () => {
    mockGetMovieDetails.mockResolvedValue(createMockMovieFull({ id: 7 }));
    mockGetMovieCredits.mockResolvedValue({ id: 7, cast: [], crew: [] });

    useMovieDetails({ movieId: 7 });
    focusCallback!();
    await flushPromises();

    expect(mockGetMovieDetails).toHaveBeenCalledWith(7);
    expect(mockGetMovieCredits).toHaveBeenCalledWith(7);
  });

  it('should handle empty cast in credits response', async () => {
    mockGetMovieDetails.mockResolvedValue(createMockMovieFull());
    mockGetMovieCredits.mockResolvedValue({ id: 42, cast: [], crew: [] });

    useMovieDetails({ movieId: 42 });
    focusCallback!();
    await flushPromises();

    expect(mockSetState).toHaveBeenCalledWith(
      expect.objectContaining({ cast: [] }),
    );
  });

  it('should set isLoading to false after successful fetch', async () => {
    mockGetMovieDetails.mockResolvedValue(createMockMovieFull());
    mockGetMovieCredits.mockResolvedValue({ id: 42, cast: [], crew: [] });

    useMovieDetails({ movieId: 42 });
    focusCallback!();
    await flushPromises();

    expect(mockSetState).toHaveBeenCalledWith(
      expect.objectContaining({ isLoading: false }),
    );
  });
});
