import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import { ActivityIndicator, Text, Button, ScrollView } from 'react-native';
import { Movie, OriginalLanguage } from '@interfaces/index';
import { HomeScreen } from '../index';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 0, left: 0, right: 0 }),
}));

const mockHandleBgMainColors = jest.fn();

jest.mock('@context/index', () => {
  const ReactModule = require('react');
  return {
    GradientContext: ReactModule.createContext({
      handleBgMainColors: mockHandleBgMainColors,
      previousColors: { primary: 'transparent', secondary: 'transparent' },
      mainColors: { primary: 'transparent', secondary: 'transparent' },
      handleBgPreviousColors: jest.fn(),
    }),
  };
});

jest.mock('@helpers/index', () => ({
  getColorsMediaFile: jest.fn().mockResolvedValue(['#FF0000', '#0000FF']),
  formatCastURL: jest.fn(casts => casts),
}));

jest.mock('@components/index', () => ({
  GradientWrapper: ({ children }: any) => <>{children}</>,
  MoviePoster: ({ movie }: any) => (
    <mock-movie-poster testID={`poster-${movie.id}`} movie={movie} />
  ),
  MoviesCarrousel: ({ title, movies }: any) => (
    <mock-movies-carrousel
      testID={`carrousel-${title}`}
      title={title}
      movies={movies}
    />
  ),
}));

jest.mock('react-native-snap-carousel', () => {
  const ReactModule = require('react');
  return {
    __esModule: true,
    default: ({ data, renderItem, onSnapToItem }: any) => (
      <mock-carousel testID="carousel" data={data} onSnapToItem={onSnapToItem}>
        {data.map((item: any, index: number) =>
          ReactModule.cloneElement(renderItem({ item, index }), {
            key: item.id,
          }),
        )}
      </mock-carousel>
    ),
  };
});

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mock-movie-poster': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { movie?: any; testID?: string },
        HTMLElement
      >;
      'mock-movies-carrousel': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          title?: string;
          movies?: any[];
          testID?: string;
        },
        HTMLElement
      >;
      'mock-carousel': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          data?: any[];
          onSnapToItem?: (index: number) => void;
          testID?: string;
        },
        HTMLElement
      >;
    }
  }
}

const mockUseMovies = jest.fn();
jest.mock('../useMovies', () => ({
  useMovies: () => mockUseMovies(),
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
  poster_path: 'https://image.tmdb.org/t/p/w500/poster.jpg',
  release_date: '2024-01-01',
  title: 'Test Movie',
  video: false,
  vote_average: 7.5,
  vote_count: 1000,
  ...overrides,
});

const mockNowPlaying = [
  createMockMovie({ id: 1, title: 'Now Playing 1' }),
  createMockMovie({ id: 2, title: 'Now Playing 2' }),
];
const mockPopular = [createMockMovie({ id: 3, title: 'Popular 1' })];
const mockTopRated = [createMockMovie({ id: 4, title: 'Top Rated 1' })];
const mockUpcoming = [createMockMovie({ id: 5, title: 'Upcoming 1' })];

const mockHandleGetMovies = jest.fn();

const defaultHookReturn = {
  nowPlaying: mockNowPlaying,
  popular: mockPopular,
  topRated: mockTopRated,
  upcoming: mockUpcoming,
  isLoading: false,
  hasAnyError: false,
  handleGetMovies: mockHandleGetMovies,
};

describe('HomeScreen', () => {
  let renderer: ReactTestRenderer;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMovies.mockReturnValue(defaultHookReturn);
  });

  it('should render correctly when data is loaded', () => {
    act(() => {
      renderer = create(<HomeScreen />);
    });
    expect(renderer.toJSON()).toBeTruthy();
  });

  it('should show ActivityIndicator when loading', () => {
    mockUseMovies.mockReturnValue({
      ...defaultHookReturn,
      isLoading: true,
      nowPlaying: [],
      popular: [],
      topRated: [],
      upcoming: [],
    });
    act(() => {
      renderer = create(<HomeScreen />);
    });
    const indicator = renderer.root.findByType(ActivityIndicator);
    expect(indicator).toBeTruthy();
    expect(indicator.props.color).toBe('red');
    expect(indicator.props.size).toBe(100);
  });

  it('should not show ScrollView content when loading', () => {
    mockUseMovies.mockReturnValue({
      ...defaultHookReturn,
      isLoading: true,
    });
    act(() => {
      renderer = create(<HomeScreen />);
    });
    const scrollViews = renderer.root.findAllByType(ScrollView);
    expect(scrollViews).toHaveLength(0);
  });

  it('should show error view when hasAnyError is true', () => {
    mockUseMovies.mockReturnValue({
      ...defaultHookReturn,
      hasAnyError: true,
    });
    act(() => {
      renderer = create(<HomeScreen />);
    });
    const textElements = renderer.root.findAllByType(Text);
    const errorText = textElements.find(
      t => t.props.children === 'Error on load movies',
    );
    expect(errorText).toBeTruthy();
  });

  it('should show a retry button when hasAnyError is true', () => {
    mockUseMovies.mockReturnValue({
      ...defaultHookReturn,
      hasAnyError: true,
    });
    act(() => {
      renderer = create(<HomeScreen />);
    });
    const button = renderer.root.findByType(Button);
    expect(button.props.title).toBe('Load again movies');
  });

  it('should call handleGetMovies when retry button is pressed', () => {
    mockUseMovies.mockReturnValue({
      ...defaultHookReturn,
      hasAnyError: true,
    });
    act(() => {
      renderer = create(<HomeScreen />);
    });
    const button = renderer.root.findByType(Button);
    act(() => {
      button.props.onPress();
    });
    expect(mockHandleGetMovies).toHaveBeenCalledTimes(1);
  });

  it('should render the main carousel with nowPlaying movies', () => {
    act(() => {
      renderer = create(<HomeScreen />);
    });
    const carousel = renderer.root.findByProps({ testID: 'carousel' });
    expect(carousel.props.data).toEqual(mockNowPlaying);
  });

  it('should render MoviePoster components inside the carousel', () => {
    act(() => {
      renderer = create(<HomeScreen />);
    });
    const posters = renderer.root.findAllByType(
      'mock-movie-poster' as unknown as React.ComponentClass,
    );
    expect(posters.length).toBeGreaterThanOrEqual(2);
  });

  it('should render Popular carrousel with correct props', () => {
    act(() => {
      renderer = create(<HomeScreen />);
    });
    const popularCarrousel = renderer.root.findByProps({
      testID: 'carrousel-Popular',
    });
    expect(popularCarrousel.props.title).toBe('Popular');
    expect(popularCarrousel.props.movies).toEqual(mockPopular);
  });

  it('should render Top Rated carrousel with correct props', () => {
    act(() => {
      renderer = create(<HomeScreen />);
    });
    const topRatedCarrousel = renderer.root.findByProps({
      testID: 'carrousel-Top Rated',
    });
    expect(topRatedCarrousel.props.title).toBe('Top Rated');
    expect(topRatedCarrousel.props.movies).toEqual(mockTopRated);
  });

  it('should render Upcoming carrousel with correct props', () => {
    act(() => {
      renderer = create(<HomeScreen />);
    });
    const upcomingCarrousel = renderer.root.findByProps({
      testID: 'carrousel-Upcoming',
    });
    expect(upcomingCarrousel.props.title).toBe('Upcoming');
    expect(upcomingCarrousel.props.movies).toEqual(mockUpcoming);
  });

  it('should render three MoviesCarrousel sections', () => {
    act(() => {
      renderer = create(<HomeScreen />);
    });
    const carrousels = renderer.root.findAllByType(
      'mock-movies-carrousel' as unknown as React.ComponentClass,
    );
    expect(carrousels).toHaveLength(3);
  });

  it('should prioritize error view over loading view', () => {
    mockUseMovies.mockReturnValue({
      ...defaultHookReturn,
      hasAnyError: true,
      isLoading: true,
    });
    act(() => {
      renderer = create(<HomeScreen />);
    });
    const textElements = renderer.root.findAllByType(Text);
    const errorText = textElements.find(
      t => t.props.children === 'Error on load movies',
    );
    expect(errorText).toBeTruthy();
    const indicators = renderer.root.findAllByType(ActivityIndicator);
    expect(indicators).toHaveLength(0);
  });

  it('should call onSnapToItem handler on the carousel', async () => {
    const { getColorsMediaFile } = require('@helpers/index');
    act(() => {
      renderer = create(<HomeScreen />);
    });
    const carousel = renderer.root.findByProps({ testID: 'carousel' });
    await act(async () => {
      carousel.props.onSnapToItem(0);
    });
    expect(getColorsMediaFile).toHaveBeenCalledWith(
      'https://image.tmdb.org/t/p/w500/poster.jpg',
    );
  });

  it('should not call getColorsMediaFile when poster_path is null', async () => {
    const { getColorsMediaFile } = require('@helpers/index');
    mockUseMovies.mockReturnValue({
      ...defaultHookReturn,
      nowPlaying: [createMockMovie({ id: 1, poster_path: null })],
    });
    act(() => {
      renderer = create(<HomeScreen />);
    });
    const carousel = renderer.root.findByProps({ testID: 'carousel' });
    await act(async () => {
      carousel.props.onSnapToItem(0);
    });
    expect(getColorsMediaFile).not.toHaveBeenCalled();
  });

  it('should match snapshot when loaded', () => {
    act(() => {
      renderer = create(<HomeScreen />);
    });
    expect(renderer.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot when loading', () => {
    mockUseMovies.mockReturnValue({
      ...defaultHookReturn,
      isLoading: true,
    });
    act(() => {
      renderer = create(<HomeScreen />);
    });
    expect(renderer.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot when error', () => {
    mockUseMovies.mockReturnValue({
      ...defaultHookReturn,
      hasAnyError: true,
    });
    act(() => {
      renderer = create(<HomeScreen />);
    });
    expect(renderer.toJSON()).toMatchSnapshot();
  });
});
