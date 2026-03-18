import { transformMovieCredits } from '../movieCredits';
import { IMovieCredits, Cast } from '@interfaces/index';
import { formatCastURL } from '@helpers/index';

jest.mock('@helpers/index', () => ({
  formatCastURL: jest.fn((casts: Cast[]) =>
    casts.map(c => ({ ...c, profile_path: `formatted_${c.profile_path}` })),
  ),
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

describe('transformMovieCredits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call formatCastURL with the cast array', () => {
    const credits: IMovieCredits = {
      id: 1,
      cast: [createMockCast({ id: 1 }), createMockCast({ id: 2 })],
      crew: [],
    };
    transformMovieCredits(credits);
    expect(formatCastURL).toHaveBeenCalledWith(credits.cast);
  });

  it('should return transformed cast from formatCastURL', () => {
    const credits: IMovieCredits = {
      id: 1,
      cast: [createMockCast({ id: 1, profile_path: '/actor.jpg' })],
      crew: [],
    };
    const result = transformMovieCredits(credits);
    expect(result.cast[0].profile_path).toBe('formatted_/actor.jpg');
  });

  it('should preserve the id property', () => {
    const credits: IMovieCredits = {
      id: 42,
      cast: [createMockCast()],
      crew: [],
    };
    const result = transformMovieCredits(credits);
    expect(result.id).toBe(42);
  });

  it('should preserve the crew property', () => {
    const crewMember = createMockCast({
      id: 10,
      known_for_department: 'Directing',
    });
    const credits: IMovieCredits = {
      id: 1,
      cast: [createMockCast()],
      crew: [crewMember],
    };
    const result = transformMovieCredits(credits);
    expect(result.crew).toEqual([crewMember]);
  });

  it('should handle empty cast array', () => {
    const credits: IMovieCredits = {
      id: 1,
      cast: [],
      crew: [],
    };
    const result = transformMovieCredits(credits);
    expect(formatCastURL).toHaveBeenCalledWith([]);
    expect(result.cast).toEqual([]);
  });
});
