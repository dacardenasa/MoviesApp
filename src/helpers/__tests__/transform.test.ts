import { formatCastURL } from '../transform';
import { Cast } from '@interfaces/index';
import Config from 'react-native-config';

jest.mock('react-native-config', () => ({
  BASE_URL_TMDB_IMAGE: 'https://image.tmdb.org/t/p/w500',
}));

const createMockCast = (overrides: Partial<Cast> = {}): Cast => ({
  adult: false,
  gender: 1,
  id: 1,
  known_for_department: 'Acting',
  name: 'Jane Doe',
  original_name: 'Jane Doe',
  popularity: 50,
  profile_path: '/profile.jpg',
  cast_id: 1,
  character: 'Hero',
  credit_id: 'abc123',
  order: 0,
  ...overrides,
});

describe('formatCastURL', () => {
  it('should prepend base URL to profile_path', () => {
    const cast = [createMockCast({ profile_path: '/profile.jpg' })];
    const result = formatCastURL(cast);
    expect(result[0].profile_path).toBe(
      'https://image.tmdb.org/t/p/w500/profile.jpg',
    );
  });

  it('should set profile_path to null when it is null', () => {
    const cast = [createMockCast({ profile_path: null })];
    const result = formatCastURL(cast);
    expect(result[0].profile_path).toBeNull();
  });

  it('should handle multiple cast members', () => {
    const cast = [
      createMockCast({ id: 1, profile_path: '/actor1.jpg' }),
      createMockCast({ id: 2, profile_path: '/actor2.jpg' }),
      createMockCast({ id: 3, profile_path: null }),
    ];
    const result = formatCastURL(cast);
    expect(result[0].profile_path).toBe(
      'https://image.tmdb.org/t/p/w500/actor1.jpg',
    );
    expect(result[1].profile_path).toBe(
      'https://image.tmdb.org/t/p/w500/actor2.jpg',
    );
    expect(result[2].profile_path).toBeNull();
  });

  it('should return an empty array for empty input', () => {
    const result = formatCastURL([]);
    expect(result).toEqual([]);
  });

  it('should preserve all other cast properties', () => {
    const cast = [
      createMockCast({
        id: 5,
        name: 'Test Actor',
        character: 'Side Character',
        profile_path: '/test.jpg',
      }),
    ];
    const result = formatCastURL(cast);
    expect(result[0].id).toBe(5);
    expect(result[0].name).toBe('Test Actor');
    expect(result[0].character).toBe('Side Character');
    expect(result[0].profile_path).toBe(
      `${Config.BASE_URL_TMDB_IMAGE}/test.jpg`,
    );
  });
});
