import { Animated } from 'react-native';
import { useFadeAnimation } from '../useFadeAnimation';

let hookResult: ReturnType<typeof useFadeAnimation>;

jest.mock('react', () => {
  const actualReact = jest.requireActual('react');
  return {
    ...actualReact,
    useRef: (initial: any) => ({ current: initial }),
  };
});

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  hookResult = useFadeAnimation();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useFadeAnimation', () => {
  it('should return opacity as an Animated.Value', () => {
    expect(hookResult.opacity).toBeInstanceOf(Animated.Value);
  });

  it('should initialize opacity to 0', () => {
    const opacityValue = (hookResult.opacity as any).__getValue();
    expect(opacityValue).toBe(0);
  });

  it('should return fadeIn as a function', () => {
    expect(typeof hookResult.fadeIn).toBe('function');
  });

  it('should return fadeOut as a function', () => {
    expect(typeof hookResult.fadeOut).toBe('function');
  });

  it('should animate opacity to 1 when fadeIn is called', () => {
    const timingSpy = jest.spyOn(Animated, 'timing');
    hookResult.fadeIn();
    expect(timingSpy).toHaveBeenCalledWith(hookResult.opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    });
    timingSpy.mockRestore();
  });

  it('should animate opacity to 0 when fadeOut is called', () => {
    const timingSpy = jest.spyOn(Animated, 'timing');
    hookResult.fadeOut();
    expect(timingSpy).toHaveBeenCalledWith(hookResult.opacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    });
    timingSpy.mockRestore();
  });

  it('should invoke callback after fadeIn animation completes', () => {
    const mockCallback = jest.fn();
    const mockStart = jest.fn(
      (cb?: (result: { finished: boolean }) => void) => {
        if (cb) {
          cb({ finished: true });
        }
      },
    );
    jest.spyOn(Animated, 'timing').mockReturnValue({
      start: mockStart,
      stop: jest.fn(),
      reset: jest.fn(),
    } as any);

    hookResult.fadeIn(mockCallback);
    expect(mockStart).toHaveBeenCalled();
    expect(mockCallback).toHaveBeenCalled();

    (Animated.timing as any).mockRestore();
  });

  it('should not throw when fadeIn is called without callback', () => {
    const mockStart = jest.fn(
      (cb?: (result: { finished: boolean }) => void) => {
        if (cb) {
          cb({ finished: true });
        }
      },
    );
    jest.spyOn(Animated, 'timing').mockReturnValue({
      start: mockStart,
      stop: jest.fn(),
      reset: jest.fn(),
    } as any);

    expect(() => hookResult.fadeIn()).not.toThrow();

    (Animated.timing as any).mockRestore();
  });
});
