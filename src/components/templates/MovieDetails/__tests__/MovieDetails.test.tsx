import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import { Text } from 'react-native';
import { MovieDetails } from '../index';
import { IMovieFull, Cast } from '@interfaces/index';

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

const createMockMovieDetails = (
  overrides: Partial<IMovieFull> = {},
): IMovieFull => ({
  adult: false,
  backdrop_path: null,
  belongs_to_collection: null,
  budget: '$120,000,000',
  genres: [
    { id: 28, name: 'Acción' },
    { id: 12, name: 'Aventura' },
  ],
  homepage: 'https://example.com',
  id: 1,
  imdb_id: 'tt1234567',
  original_language: 'en',
  original_title: 'Test Movie',
  overview: 'Una gran película de prueba.',
  popularity: 100,
  poster_path: '/poster.jpg',
  production_companies: [
    {
      id: 1,
      logo_path: '/logo.png',
      name: 'Test Studio',
      origin_country: 'US',
    },
  ],
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

const createMockCast = (overrides: Partial<Cast> = {}): Cast => ({
  adult: false,
  gender: 1,
  id: 1,
  known_for_department: 'Acting',
  name: 'Jane Doe',
  original_name: 'Jane Doe',
  popularity: 50,
  profile_path: 'https://image.tmdb.org/t/p/w500/profile.jpg',
  cast_id: 1,
  character: 'Hero',
  credit_id: 'abc123',
  order: 0,
  ...overrides,
});

const mockCast: Cast[] = [
  createMockCast({ id: 1, name: 'Jane Doe', character: 'Hero' }),
  createMockCast({ id: 2, name: 'John Smith', character: 'Villain' }),
];

describe('MovieDetails', () => {
  let renderer: ReactTestRenderer;
  const mockMovieDetails = createMockMovieDetails();

  it('should render correctly', () => {
    act(() => {
      renderer = create(
        <MovieDetails movieDetails={mockMovieDetails} cast={mockCast} />,
      );
    });
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();
  });

  it('should display vote average and genres', () => {
    act(() => {
      renderer = create(
        <MovieDetails movieDetails={mockMovieDetails} cast={mockCast} />,
      );
    });
    const textElements = renderer.root.findAllByType(Text);
    const genresText = textElements.find(
      t => t.props.children === '7.5 - Acción, Aventura',
    );
    expect(genresText).toBeTruthy();
  });

  it('should display the overview', () => {
    act(() => {
      renderer = create(
        <MovieDetails movieDetails={mockMovieDetails} cast={mockCast} />,
      );
    });
    const textElements = renderer.root.findAllByType(Text);
    const overviewText = textElements.find(
      t => t.props.children === 'Una gran película de prueba.',
    );
    expect(overviewText).toBeTruthy();
  });

  it('should display the budget', () => {
    act(() => {
      renderer = create(
        <MovieDetails movieDetails={mockMovieDetails} cast={mockCast} />,
      );
    });
    const textElements = renderer.root.findAllByType(Text);
    const budgetText = textElements.find(
      t => t.props.children === '$120,000,000',
    );
    expect(budgetText).toBeTruthy();
  });

  it('should display section labels in Spanish', () => {
    act(() => {
      renderer = create(
        <MovieDetails movieDetails={mockMovieDetails} cast={mockCast} />,
      );
    });
    const textElements = renderer.root.findAllByType(Text);
    const labels = textElements
      .map(t => t.props.children)
      .filter((c): c is string => typeof c === 'string');
    expect(labels).toContain('Historia');
    expect(labels).toContain('Presupuesto');
    expect(labels).toContain('Actores');
  });

  it('should render the star icon', () => {
    act(() => {
      renderer = create(
        <MovieDetails movieDetails={mockMovieDetails} cast={mockCast} />,
      );
    });
    const icon = renderer.root.findByType(
      'Icon' as unknown as React.ComponentClass,
    );
    expect(icon.props.name).toBe('star-outline');
    expect(icon.props.color).toBe('grey');
    expect(icon.props.size).toBe(16);
  });

  it('should render MovieCastCarrousel with cast data', () => {
    act(() => {
      renderer = create(
        <MovieDetails movieDetails={mockMovieDetails} cast={mockCast} />,
      );
    });
    const castCarrousel = renderer.root.findByProps({ cast: mockCast });
    expect(castCarrousel).toBeTruthy();
  });

  it('should handle a single genre', () => {
    const singleGenreMovie = createMockMovieDetails({
      genres: [{ id: 35, name: 'Comedia' }],
      vote_average: 8.0,
    });
    act(() => {
      renderer = create(
        <MovieDetails movieDetails={singleGenreMovie} cast={mockCast} />,
      );
    });
    const textElements = renderer.root.findAllByType(Text);
    const genresText = textElements.find(
      t => t.props.children === '8 - Comedia',
    );
    expect(genresText).toBeTruthy();
  });

  it('should handle empty genres list', () => {
    const noGenresMovie = createMockMovieDetails({
      genres: [],
      vote_average: 6.0,
    });
    act(() => {
      renderer = create(
        <MovieDetails movieDetails={noGenresMovie} cast={mockCast} />,
      );
    });
    const textElements = renderer.root.findAllByType(Text);
    const genresText = textElements.find(t => t.props.children === '6 - ');
    expect(genresText).toBeTruthy();
  });

  it('should handle empty cast list', () => {
    act(() => {
      renderer = create(
        <MovieDetails movieDetails={mockMovieDetails} cast={[]} />,
      );
    });
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();
  });

  it('should match snapshot', () => {
    act(() => {
      renderer = create(
        <MovieDetails movieDetails={mockMovieDetails} cast={mockCast} />,
      );
    });
    expect(renderer.toJSON()).toMatchSnapshot();
  });
});
