import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import { TouchableOpacity, Image } from 'react-native';
import { MoviePoster } from '../index';
import { Movie, OriginalLanguage } from '@interfaces/index';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

const mockMovie: Movie = {
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
  vote_average: 8.5,
  vote_count: 1000,
};

describe('MoviePoster', () => {
  let renderer: ReactTestRenderer;

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('Should render correctly with default dimensions', () => {
    act(() => {
      renderer = create(<MoviePoster movie={mockMovie} />);
    });
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();
  });

  it('Should render the movie poster image with correct URI', () => {
    act(() => {
      renderer = create(<MoviePoster movie={mockMovie} />);
    });
    const image = renderer.root.findByType(Image);
    expect(image.props.source).toEqual({ uri: mockMovie.poster_path });
  });

  it('Should apply default width and height', () => {
    act(() => {
      renderer = create(<MoviePoster movie={mockMovie} />);
    });
    const touchable = renderer.root.findByType(TouchableOpacity);
    expect(touchable.props.style).toEqual(
      expect.objectContaining({ width: 300, height: 420 }),
    );
  });

  it('Should apply custom width and height', () => {
    act(() => {
      renderer = create(
        <MoviePoster movie={mockMovie} width={150} height={200} />,
      );
    });
    const touchable = renderer.root.findByType(TouchableOpacity);
    expect(touchable.props.style).toEqual(
      expect.objectContaining({ width: 150, height: 200 }),
    );
  });

  it('Should navigate to DetailScreen with movie data on press', () => {
    act(() => {
      renderer = create(<MoviePoster movie={mockMovie} />);
    });
    const touchable = renderer.root.findByType(TouchableOpacity);
    act(() => {
      touchable.props.onPress();
    });
    expect(mockNavigate).toHaveBeenCalledWith('DetailScreen', {
      movie: mockMovie,
    });
  });

  it('Should have activeOpacity set to 0.8', () => {
    act(() => {
      renderer = create(<MoviePoster movie={mockMovie} />);
    });
    const touchable = renderer.root.findByType(TouchableOpacity);
    expect(touchable.props.activeOpacity).toBe(0.8);
  });

  it('Should matches snapshot', () => {
    act(() => {
      renderer = create(<MoviePoster movie={mockMovie} />);
    });
    expect(renderer.toJSON()).toMatchSnapshot();
  });
});
