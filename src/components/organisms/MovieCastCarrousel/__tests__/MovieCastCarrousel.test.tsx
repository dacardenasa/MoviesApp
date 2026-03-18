import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import { FlatList, View } from 'react-native';
import { MovieCastCarrousel } from '../index';
import { Cast } from '@interfaces/index';

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

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

const mockCastList: Cast[] = [
  createMockCast({ id: 1, name: 'Jane Doe', character: 'Hero' }),
  createMockCast({ id: 2, name: 'John Smith', character: 'Villain' }),
  createMockCast({ id: 3, name: 'Alice Brown', character: 'Sidekick' }),
];

describe('MovieCastCarrousel', () => {
  let renderer: ReactTestRenderer;

  it('should render correctly with a list of cast members', () => {
    act(() => {
      renderer = create(<MovieCastCarrousel cast={mockCastList} />);
    });
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();
  });

  it('should render a FlatList component', () => {
    act(() => {
      renderer = create(<MovieCastCarrousel cast={mockCastList} />);
    });
    const flatList = renderer.root.findByType(FlatList);
    expect(flatList).toBeTruthy();
  });

  it('should pass the cast data to FlatList', () => {
    act(() => {
      renderer = create(<MovieCastCarrousel cast={mockCastList} />);
    });
    const flatList = renderer.root.findByType(FlatList);
    expect(flatList.props.data).toEqual(mockCastList);
  });

  it('should render the correct number of cast cards', () => {
    act(() => {
      renderer = create(<MovieCastCarrousel cast={mockCastList} />);
    });
    const flatList = renderer.root.findByType(FlatList);
    const { renderItem } = flatList.props;
    mockCastList.forEach((cast, index) => {
      const element = renderItem({ item: cast, index });
      expect(element).toBeTruthy();
    });
  });

  it('should configure horizontal scrolling', () => {
    act(() => {
      renderer = create(<MovieCastCarrousel cast={mockCastList} />);
    });
    const flatList = renderer.root.findByType(FlatList);
    expect(flatList.props.horizontal).toBe(true);
    expect(flatList.props.showsHorizontalScrollIndicator).toBe(false);
  });

  it('should generate unique keys using cast id and index', () => {
    act(() => {
      renderer = create(<MovieCastCarrousel cast={mockCastList} />);
    });
    const flatList = renderer.root.findByType(FlatList);
    const { keyExtractor } = flatList.props;
    expect(keyExtractor(mockCastList[0], 0)).toBe('1-0');
    expect(keyExtractor(mockCastList[1], 1)).toBe('2-1');
    expect(keyExtractor(mockCastList[2], 2)).toBe('3-2');
  });

  it('should render a separator between items', () => {
    act(() => {
      renderer = create(<MovieCastCarrousel cast={mockCastList} />);
    });
    const flatList = renderer.root.findByType(FlatList);
    const Separator = flatList.props.ItemSeparatorComponent;
    expect(Separator).toBeTruthy();
    let separatorRenderer: ReactTestRenderer;
    act(() => {
      separatorRenderer = create(<Separator />);
    });
    const separatorView = separatorRenderer!.root.findByType(View);
    expect(separatorView.props.style).toEqual({ width: 50 });
  });

  it('should render correctly with an empty cast list', () => {
    act(() => {
      renderer = create(<MovieCastCarrousel cast={[]} />);
    });
    const flatList = renderer.root.findByType(FlatList);
    expect(flatList.props.data).toEqual([]);
  });

  it('should render correctly with a single cast member', () => {
    const singleCast = [mockCastList[0]];
    act(() => {
      renderer = create(<MovieCastCarrousel cast={singleCast} />);
    });
    const flatList = renderer.root.findByType(FlatList);
    expect(flatList.props.data).toHaveLength(1);
  });

  it('should handle cast members with null profile_path', () => {
    const castWithNullImage = [createMockCast({ id: 10, profile_path: null })];
    act(() => {
      renderer = create(<MovieCastCarrousel cast={castWithNullImage} />);
    });
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();
  });

  it('should match snapshot', () => {
    act(() => {
      renderer = create(<MovieCastCarrousel cast={mockCastList} />);
    });
    expect(renderer.toJSON()).toMatchSnapshot();
  });
});
