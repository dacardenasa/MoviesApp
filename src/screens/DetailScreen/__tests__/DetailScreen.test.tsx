import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import { Image, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Movie, OriginalLanguage, Cast, IMovieFull } from '@interfaces/index';
import { DetailScreen } from '../index';

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

const mockGoBack = jest.fn();

const mockUseMovieDetails = jest.fn();
jest.mock('../useMovieDetails', () => ({
  useMovieDetails: (...args: any[]) => mockUseMovieDetails(...args),
}));

jest.mock('@components/index', () => ({
  MovieDetails: ({ movieDetails, cast }: any) => (
    <mock-movie-details movieDetails={movieDetails} cast={cast} />
  ),
}));

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mock-movie-details': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          movieDetails?: any;
          cast?: any;
        },
        HTMLElement
      >;
    }
  }
}

const createMockMovie = (overrides: Partial<Movie> = {}): Movie => ({
  adult: false,
  backdrop_path: '/backdrop.jpg',
  genre_ids: [28, 12],
  id: 42,
  original_language: OriginalLanguage.En,
  original_title: 'Original Test Movie',
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

const createMockMovieFull = (
  overrides: Partial<IMovieFull> = {},
): IMovieFull => ({
  adult: false,
  backdrop_path: null,
  belongs_to_collection: null,
  budget: '$120,000,000',
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
  name: 'Jane Doe',
  original_name: 'Jane Doe',
  popularity: 50,
  profile_path: 'https://image.tmdb.org/t/p/w500/profile.jpg',
  character: 'Hero',
  credit_id: 'abc123',
  order: 0,
  ...overrides,
});

const createProps = (movieOverrides: Partial<Movie> = {}) => ({
  route: {
    params: { movie: createMockMovie(movieOverrides) },
    key: 'DetailScreen',
    name: 'DetailScreen' as const,
  },
  navigation: {
    goBack: mockGoBack,
    dispatch: jest.fn(),
    navigate: jest.fn(),
    reset: jest.fn(),
    setParams: jest.fn(),
    isFocused: jest.fn(),
    canGoBack: jest.fn(),
    getId: jest.fn(),
    getParent: jest.fn(),
    getState: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    setOptions: jest.fn(),
    pop: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  } as any,
});

describe('DetailScreen', () => {
  let renderer: ReactTestRenderer;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMovieDetails.mockReturnValue({
      isLoading: false,
      movieDetails: createMockMovieFull(),
      cast: [createMockCast()],
    });
  });

  it('should render correctly', () => {
    act(() => {
      renderer = create(<DetailScreen {...createProps()} />);
    });
    expect(renderer.toJSON()).toBeTruthy();
  });

  it('should call useMovieDetails with the movie id', () => {
    act(() => {
      renderer = create(<DetailScreen {...createProps({ id: 99 })} />);
    });
    expect(mockUseMovieDetails).toHaveBeenCalledWith({ movieId: 99 });
  });

  it('should display the movie poster image when poster_path exists', () => {
    act(() => {
      renderer = create(<DetailScreen {...createProps()} />);
    });
    const images = renderer.root.findAllByType(Image);
    const posterImage = images.find(
      img =>
        img.props.source?.uri === 'https://image.tmdb.org/t/p/w500/poster.jpg',
    );
    expect(posterImage).toBeTruthy();
  });

  it('should display a fallback icon when poster_path is null', () => {
    act(() => {
      renderer = create(
        <DetailScreen {...createProps({ poster_path: null })} />,
      );
    });
    const images = renderer.root.findAllByType(Image);
    expect(images).toHaveLength(0);

    const icons = renderer.root.findAllByType(
      'Icon' as unknown as React.ComponentClass,
    );
    const fallbackIcon = icons.find(
      icon => icon.props.name === 'image-outline',
    );
    expect(fallbackIcon).toBeTruthy();
  });

  it('should display the original title', () => {
    act(() => {
      renderer = create(<DetailScreen {...createProps()} />);
    });
    const textElements = renderer.root.findAllByType(Text);
    const originalTitle = textElements.find(
      t => t.props.children === 'Original Test Movie',
    );
    expect(originalTitle).toBeTruthy();
  });

  it('should display the movie title', () => {
    act(() => {
      renderer = create(<DetailScreen {...createProps()} />);
    });
    const textElements = renderer.root.findAllByType(Text);
    const title = textElements.find(t => t.props.children === 'Test Movie');
    expect(title).toBeTruthy();
  });

  it('should show ActivityIndicator when loading', () => {
    mockUseMovieDetails.mockReturnValue({
      isLoading: true,
      movieDetails: undefined,
      cast: [],
    });
    act(() => {
      renderer = create(<DetailScreen {...createProps()} />);
    });
    const indicator = renderer.root.findByType(ActivityIndicator);
    expect(indicator).toBeTruthy();
    expect(indicator.props.size).toBe(35);
    expect(indicator.props.color).toBe('gray');
  });

  it('should render MovieDetails when not loading', () => {
    const mockDetails = createMockMovieFull();
    const mockCast = [createMockCast()];
    mockUseMovieDetails.mockReturnValue({
      isLoading: false,
      movieDetails: mockDetails,
      cast: mockCast,
    });
    act(() => {
      renderer = create(<DetailScreen {...createProps()} />);
    });
    const movieDetails = renderer.root.findByType(
      'mock-movie-details' as unknown as React.ComponentClass,
    );
    expect(movieDetails.props.movieDetails).toEqual(mockDetails);
    expect(movieDetails.props.cast).toEqual(mockCast);
  });

  it('should not render MovieDetails when loading', () => {
    mockUseMovieDetails.mockReturnValue({
      isLoading: true,
      movieDetails: undefined,
      cast: [],
    });
    act(() => {
      renderer = create(<DetailScreen {...createProps()} />);
    });
    const movieDetailsElements = renderer.root.findAllByType(
      'mock-movie-details' as unknown as React.ComponentClass,
    );
    expect(movieDetailsElements).toHaveLength(0);
  });

  it('should navigate back when back button is pressed', () => {
    act(() => {
      renderer = create(<DetailScreen {...createProps()} />);
    });
    const backButton = renderer.root.findByType(TouchableOpacity);
    act(() => {
      backButton.props.onPress();
    });
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('should render the back arrow icon', () => {
    act(() => {
      renderer = create(<DetailScreen {...createProps()} />);
    });
    const icons = renderer.root.findAllByType(
      'Icon' as unknown as React.ComponentClass,
    );
    const backIcon = icons.find(
      icon => icon.props.name === 'arrow-back-outline',
    );
    expect(backIcon).toBeTruthy();
    expect(backIcon!.props.color).toBe('white');
    expect(backIcon!.props.size).toBe(60);
  });

  it('should match snapshot when loaded', () => {
    act(() => {
      renderer = create(<DetailScreen {...createProps()} />);
    });
    expect(renderer.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot when loading', () => {
    mockUseMovieDetails.mockReturnValue({
      isLoading: true,
      movieDetails: undefined,
      cast: [],
    });
    act(() => {
      renderer = create(<DetailScreen {...createProps()} />);
    });
    expect(renderer.toJSON()).toMatchSnapshot();
  });
});
