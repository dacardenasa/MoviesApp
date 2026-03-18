import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import { Image, Text } from 'react-native';
import { MovieCastCard } from '../index';
import { Cast } from '@interfaces/index';

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

const mockCast: Cast = {
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
};

const mockCastWithoutImage: Cast = {
  ...mockCast,
  id: 2,
  profile_path: null,
};

const mockCastLongCharacter: Cast = {
  ...mockCast,
  id: 3,
  character: 'A Very Long Character Name That Exceeds Twenty',
};

describe('MovieCastCard', () => {
  let renderer: ReactTestRenderer;

  it('Should render correctly with profile image', () => {
    act(() => {
      renderer = create(<MovieCastCard cast={mockCast} />);
    });
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();
  });

  it('Should render the profile image with correct URI when profile_path exists', () => {
    act(() => {
      renderer = create(<MovieCastCard cast={mockCast} />);
    });
    const image = renderer.root.findByType(Image);
    expect(image.props.source).toEqual({ uri: mockCast.profile_path });
  });

  it('Should render a fallback icon when profile_path is null', () => {
    act(() => {
      renderer = create(<MovieCastCard cast={mockCastWithoutImage} />);
    });
    const images = renderer.root.findAllByType(Image);
    expect(images).toHaveLength(0);
    const icon = renderer.root.findByType('Icon' as any);
    expect(icon.props.name).toBe('image-outline');
    expect(icon.props.color).toBe('grey');
    expect(icon.props.size).toBe(50);
  });

  it('Should display the cast name', () => {
    act(() => {
      renderer = create(<MovieCastCard cast={mockCast} />);
    });
    const texts = renderer.root.findAllByType(Text);
    const nameText = texts.find(t => t.props.children === mockCast.name);
    expect(nameText).toBeTruthy();
  });

  it('Should display the character name', () => {
    act(() => {
      renderer = create(<MovieCastCard cast={mockCast} />);
    });
    const texts = renderer.root.findAllByType(Text);
    const characterText = texts.find(t =>
      Array.isArray(t.props.children)
        ? t.props.children.join('').includes(mockCast.character)
        : false,
    );
    expect(characterText).toBeTruthy();
  });

  it('Should truncate character names longer than 20 characters', () => {
    act(() => {
      renderer = create(<MovieCastCard cast={mockCastLongCharacter} />);
    });
    const texts = renderer.root.findAllByType(Text);
    const characterText = texts.find(t =>
      Array.isArray(t.props.children)
        ? t.props.children.join('').includes('...')
        : false,
    );
    expect(characterText).toBeTruthy();
    const content = characterText!.props.children.join('');
    expect(content).toContain('A Very Long Charact...');
  });

  it('Should not truncate character names with 20 or fewer characters', () => {
    act(() => {
      renderer = create(<MovieCastCard cast={mockCast} />);
    });
    const texts = renderer.root.findAllByType(Text);
    const characterText = texts.find(t =>
      Array.isArray(t.props.children)
        ? t.props.children.join('').includes('Hero')
        : false,
    );
    expect(characterText).toBeTruthy();
    const content = characterText!.props.children.join('');
    expect(content).not.toContain('...');
  });

  it('Should matches snapshot', () => {
    act(() => {
      renderer = create(<MovieCastCard cast={mockCast} />);
    });
    expect(renderer.toJSON()).toMatchSnapshot();
  });
});
