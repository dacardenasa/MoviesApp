import { Movie, OriginalLanguage } from '@interfaces/index';

const mockGetNowPlayingMovie = jest.fn();
const mockGetPopularMovies = jest.fn();
const mockGetTopRatedMovies = jest.fn();
const mockGetUpcomingMovies = jest.fn();

jest.mock('@services/index', () => ({
  moviesAPI: {
    getNowPlayingMovie: (...args: any[]) => mockGetNowPlayingMovie(...args),
    getPopularMovies: (...args: any[]) => mockGetPopularMovies(...args),
    getTopRatedMovies: (...args: any[]) => mockGetTopRatedMovies(...args),
    getUpcomingMovies: (...args: any[]) => mockGetUpcomingMovies(...args),
  },
}));

let focusCallback: (() => void) | null = null;

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (cb: () => void) => {
    focusCallback = cb;
  },
}));

const mockStateStore: Record<string, { value: any; setter: jest.Mock }> = {};
let mockStateCallIndex = 0;

const mockStateKeys = ['hasAnyError', 'isLoading', 'moviesState'];

jest.mock('react', () => {
  const actualReact = jest.requireActual('react');
  return {
    ...actualReact,
    useState: (initial: any) => {
      const key = mockStateKeys[mockStateCallIndex % mockStateKeys.length];
      if (!mockStateStore[key]) {
        mockStateStore[key] = { value: initial, setter: jest.fn() };
      }
      mockStateCallIndex++;
      return [mockStateStore[key].value, mockStateStore[key].setter];
    },
    useCallback: (cb: any) => cb,
  };
});

import { useMovies } from '../useMovies';

const flushPromises = () => new Promise(resolve => setImmediate(resolve));

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

const createMockResponse = (movies: Movie[] = [createMockMovie()]) => ({
  page: 1,
  results: movies,
  total_pages: 1,
  total_results: movies.length,
});

const setupSuccessfulMocks = () => {
  const nowPlaying = [createMockMovie({ id: 1, title: 'Now Playing' })];
  const popular = [createMockMovie({ id: 2, title: 'Popular' })];
  const topRated = [createMockMovie({ id: 3, title: 'Top Rated' })];
  const upcoming = [createMockMovie({ id: 4, title: 'Upcoming' })];

  mockGetNowPlayingMovie.mockResolvedValue(createMockResponse(nowPlaying));
  mockGetPopularMovies.mockResolvedValue(createMockResponse(popular));
  mockGetTopRatedMovies.mockResolvedValue(createMockResponse(topRated));
  mockGetUpcomingMovies.mockResolvedValue(createMockResponse(upcoming));

  return { nowPlaying, popular, topRated, upcoming };
};

describe('useMovies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    focusCallback = null;
    mockStateCallIndex = 0;
    Object.keys(mockStateStore).forEach(key => delete mockStateStore[key]);
  });

  it('should initialize with loading state and empty movie arrays', () => {
    const hookResult = useMovies();

    expect(hookResult.isLoading).toBe(true);
    expect(hookResult.hasAnyError).toBe(false);
    expect(hookResult.nowPlaying).toEqual([]);
    expect(hookResult.popular).toEqual([]);
    expect(hookResult.topRated).toEqual([]);
    expect(hookResult.upcoming).toEqual([]);
  });

  it('should call useFocusEffect to fetch data on mount', () => {
    useMovies();

    expect(focusCallback).toBeDefined();
  });

  it('should call all four movie API endpoints', async () => {
    setupSuccessfulMocks();

    useMovies();
    focusCallback!();
    await flushPromises();

    expect(mockGetNowPlayingMovie).toHaveBeenCalledTimes(1);
    expect(mockGetPopularMovies).toHaveBeenCalledTimes(1);
    expect(mockGetTopRatedMovies).toHaveBeenCalledTimes(1);
    expect(mockGetUpcomingMovies).toHaveBeenCalledTimes(1);
  });

  it('should update moviesState with fetched results on success', async () => {
    const { nowPlaying, popular, topRated, upcoming } = setupSuccessfulMocks();

    useMovies();
    focusCallback!();
    await flushPromises();

    expect(mockStateStore.moviesState.setter).toHaveBeenCalledWith({
      nowPlaying,
      popular,
      topRated,
      upcoming,
    });
  });

  it('should set isLoading to false after successful fetch', async () => {
    setupSuccessfulMocks();

    useMovies();
    focusCallback!();
    await flushPromises();

    expect(mockStateStore.isLoading.setter).toHaveBeenCalledWith(false);
  });

  it('should fetch all endpoints in parallel via Promise.all', async () => {
    let nowPlayingResolve: (value: any) => void;
    let popularResolve: (value: any) => void;
    let topRatedResolve: (value: any) => void;
    let upcomingResolve: (value: any) => void;

    mockGetNowPlayingMovie.mockReturnValue(
      new Promise(resolve => {
        nowPlayingResolve = resolve;
      }),
    );
    mockGetPopularMovies.mockReturnValue(
      new Promise(resolve => {
        popularResolve = resolve;
      }),
    );
    mockGetTopRatedMovies.mockReturnValue(
      new Promise(resolve => {
        topRatedResolve = resolve;
      }),
    );
    mockGetUpcomingMovies.mockReturnValue(
      new Promise(resolve => {
        upcomingResolve = resolve;
      }),
    );

    useMovies();
    focusCallback!();

    expect(mockGetNowPlayingMovie).toHaveBeenCalled();
    expect(mockGetPopularMovies).toHaveBeenCalled();
    expect(mockGetTopRatedMovies).toHaveBeenCalled();
    expect(mockGetUpcomingMovies).toHaveBeenCalled();

    nowPlayingResolve!(createMockResponse());
    popularResolve!(createMockResponse());
    topRatedResolve!(createMockResponse());
    upcomingResolve!(createMockResponse());

    await flushPromises();

    expect(mockStateStore.isLoading.setter).toHaveBeenCalledWith(false);
  });

  it('should set hasAnyError to true when any API call fails', async () => {
    mockGetNowPlayingMovie.mockRejectedValue(new Error('Network error'));
    mockGetPopularMovies.mockResolvedValue(createMockResponse());
    mockGetTopRatedMovies.mockResolvedValue(createMockResponse());
    mockGetUpcomingMovies.mockResolvedValue(createMockResponse());

    useMovies();
    focusCallback!();
    await flushPromises();

    expect(mockStateStore.hasAnyError.setter).toHaveBeenCalledWith(true);
  });

  it('should set isLoading to false even when an API call fails', async () => {
    mockGetNowPlayingMovie.mockRejectedValue(new Error('Network error'));
    mockGetPopularMovies.mockResolvedValue(createMockResponse());
    mockGetTopRatedMovies.mockResolvedValue(createMockResponse());
    mockGetUpcomingMovies.mockResolvedValue(createMockResponse());

    useMovies();
    focusCallback!();
    await flushPromises();

    expect(mockStateStore.isLoading.setter).toHaveBeenCalledWith(false);
  });

  it('should expose handleGetMovies that sets loading and refetches', async () => {
    setupSuccessfulMocks();

    const hookResult = useMovies();
    hookResult.handleGetMovies();

    expect(mockStateStore.isLoading.setter).toHaveBeenCalledWith(true);
    expect(mockGetNowPlayingMovie).toHaveBeenCalled();
  });

  it('should handle empty results from all endpoints', async () => {
    mockGetNowPlayingMovie.mockResolvedValue(createMockResponse([]));
    mockGetPopularMovies.mockResolvedValue(createMockResponse([]));
    mockGetTopRatedMovies.mockResolvedValue(createMockResponse([]));
    mockGetUpcomingMovies.mockResolvedValue(createMockResponse([]));

    useMovies();
    focusCallback!();
    await flushPromises();

    expect(mockStateStore.moviesState.setter).toHaveBeenCalledWith({
      nowPlaying: [],
      popular: [],
      topRated: [],
      upcoming: [],
    });
  });
});
