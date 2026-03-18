import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import { FlatList, Text } from 'react-native';
import { MoviesCarrousel } from '../index';
import { Movie, OriginalLanguage } from '@interfaces/index';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
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

const mockMovies: Movie[] = [
  createMockMovie({ id: 1, title: 'Movie One' }),
  createMockMovie({ id: 2, title: 'Movie Two' }),
  createMockMovie({ id: 3, title: 'Movie Three' }),
];

describe('MoviesCarrousel', () => {
  let renderer: ReactTestRenderer;

  it('should render correctly with movies and title', () => {
    act(() => {
      renderer = create(
        <MoviesCarrousel movies={mockMovies} title="Popular" />,
      );
    });
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();
  });

  it('should render the title when provided', () => {
    act(() => {
      renderer = create(
        <MoviesCarrousel movies={mockMovies} title="Popular" />,
      );
    });
    const titleText = renderer.root.findByType(Text);
    expect(titleText.props.children).toBe('Popular');
  });

  it('should not render a title when not provided', () => {
    act(() => {
      renderer = create(<MoviesCarrousel movies={mockMovies} />);
    });
    const textElements = renderer.root.findAllByType(Text);
    expect(textElements).toHaveLength(0);
  });

  it('should render a FlatList component', () => {
    act(() => {
      renderer = create(
        <MoviesCarrousel movies={mockMovies} title="Top Rated" />,
      );
    });
    const flatList = renderer.root.findByType(FlatList);
    expect(flatList).toBeTruthy();
  });

  it('should pass movies data to FlatList', () => {
    act(() => {
      renderer = create(
        <MoviesCarrousel movies={mockMovies} title="Upcoming" />,
      );
    });
    const flatList = renderer.root.findByType(FlatList);
    expect(flatList.props.data).toEqual(mockMovies);
  });

  it('should render the correct number of movie posters', () => {
    act(() => {
      renderer = create(
        <MoviesCarrousel movies={mockMovies} title="Popular" />,
      );
    });
    const flatList = renderer.root.findByType(FlatList);
    const { renderItem } = flatList.props;
    mockMovies.forEach((movie, index) => {
      const element = renderItem({ item: movie, index });
      expect(element).toBeTruthy();
    });
  });

  it('should configure horizontal scrolling', () => {
    act(() => {
      renderer = create(
        <MoviesCarrousel movies={mockMovies} title="Popular" />,
      );
    });
    const flatList = renderer.root.findByType(FlatList);
    expect(flatList.props.horizontal).toBe(true);
    expect(flatList.props.showsHorizontalScrollIndicator).toBe(false);
  });

  it('should generate unique keys using movie id', () => {
    act(() => {
      renderer = create(
        <MoviesCarrousel movies={mockMovies} title="Popular" />,
      );
    });
    const flatList = renderer.root.findByType(FlatList);
    const { keyExtractor } = flatList.props;
    expect(keyExtractor(mockMovies[0])).toBe('1');
    expect(keyExtractor(mockMovies[1])).toBe('2');
    expect(keyExtractor(mockMovies[2])).toBe('3');
  });

  it('should apply container style when title is provided', () => {
    act(() => {
      renderer = create(
        <MoviesCarrousel movies={mockMovies} title="Popular" />,
      );
    });
    const rootView = renderer.root.findAll(
      node => node.type === ('View' as React.ElementType),
    )[0];
    expect(rootView.props.style).toEqual({ height: 260 });
  });

  it('should apply withoutTitleContainer style when no title', () => {
    act(() => {
      renderer = create(<MoviesCarrousel movies={mockMovies} />);
    });
    const rootView = renderer.root.findAll(
      node => node.type === ('View' as React.ElementType),
    )[0];
    expect(rootView.props.style).toEqual({ height: 220 });
  });

  it('should render correctly with an empty movie list', () => {
    act(() => {
      renderer = create(<MoviesCarrousel movies={[]} title="Empty" />);
    });
    const flatList = renderer.root.findByType(FlatList);
    expect(flatList.props.data).toEqual([]);
  });

  it('should render correctly with a single movie', () => {
    const singleMovie = [mockMovies[0]];
    act(() => {
      renderer = create(
        <MoviesCarrousel movies={singleMovie} title="Single" />,
      );
    });
    const flatList = renderer.root.findByType(FlatList);
    expect(flatList.props.data).toHaveLength(1);
  });

  it('should match snapshot with title', () => {
    act(() => {
      renderer = create(
        <MoviesCarrousel movies={mockMovies} title="Popular" />,
      );
    });
    expect(renderer.toJSON()).toMatchSnapshot();
  });

  it('should match snapshot without title', () => {
    act(() => {
      renderer = create(<MoviesCarrousel movies={mockMovies} />);
    });
    expect(renderer.toJSON()).toMatchSnapshot();
  });
});
