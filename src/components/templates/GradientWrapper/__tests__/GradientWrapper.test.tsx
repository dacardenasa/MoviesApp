import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import { Text } from 'react-native';
import { GradientWrapper } from '../index';
import { GradientContext } from 'context/index';

const mockFadeIn = jest.fn((cb?: Function) => cb && cb());
const mockFadeOut = jest.fn();

jest.mock('hooks', () => {
  const { Animated: MockAnimated } = require('react-native');
  return {
    useFadeAnimation: () => ({
      opacity: new MockAnimated.Value(1),
      fadeIn: mockFadeIn,
      fadeOut: mockFadeOut,
    }),
  };
});

jest.mock('react-native-linear-gradient', () => 'LinearGradient');

const defaultContextValue = {
  mainColors: { primary: '#FF0000', secondary: '#00FF00' },
  previousColors: { primary: '#0000FF', secondary: '#FFFF00' },
  handleBgMainColors: jest.fn(),
  handleBgPreviousColors: jest.fn(),
};

const renderWithContext = (
  contextValue = defaultContextValue,
  children: JSX.Element = <Text>Test Child</Text>,
) => {
  let renderer: ReactTestRenderer;
  act(() => {
    renderer = create(
      <GradientContext.Provider value={contextValue}>
        <GradientWrapper>{children}</GradientWrapper>
      </GradientContext.Provider>,
    );
  });
  return renderer!;
};

describe('GradientWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with children', () => {
    const renderer = renderWithContext();
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();
  });

  it('should render children content', () => {
    const renderer = renderWithContext(
      defaultContextValue,
      <Text testID="child">Hello World</Text>,
    );
    const child = renderer.root.findByProps({ testID: 'child' });
    expect(child.props.children).toBe('Hello World');
  });

  it('should render two LinearGradient components', () => {
    const renderer = renderWithContext();
    const gradients = renderer.root.findAllByType(
      'LinearGradient' as unknown as React.ComponentClass,
    );
    expect(gradients).toHaveLength(2);
  });

  it('should pass previousColors to the background gradient', () => {
    const renderer = renderWithContext();
    const gradients = renderer.root.findAllByType(
      'LinearGradient' as unknown as React.ComponentClass,
    );
    const backgroundGradient = gradients[0];
    expect(backgroundGradient.props.colors).toEqual([
      '#0000FF',
      '#FFFF00',
      'white',
    ]);
  });

  it('should pass mainColors to the animated foreground gradient', () => {
    const renderer = renderWithContext();
    const gradients = renderer.root.findAllByType(
      'LinearGradient' as unknown as React.ComponentClass,
    );
    const foregroundGradient = gradients[1];
    expect(foregroundGradient.props.colors).toEqual([
      '#FF0000',
      '#00FF00',
      'white',
    ]);
  });

  it('should set gradient start and end points', () => {
    const renderer = renderWithContext();
    const gradients = renderer.root.findAllByType(
      'LinearGradient' as unknown as React.ComponentClass,
    );
    gradients.forEach(gradient => {
      expect(gradient.props.start).toEqual({ x: 0.1, y: 0.1 });
      expect(gradient.props.end).toEqual({ x: 0.5, y: 0.5 });
    });
  });

  it('should call fadeIn on mount', () => {
    renderWithContext();
    expect(mockFadeIn).toHaveBeenCalled();
  });

  it('should call handleBgPreviousColors with mainColors inside fadeIn callback', () => {
    renderWithContext();
    expect(defaultContextValue.handleBgPreviousColors).toHaveBeenCalledWith(
      defaultContextValue.mainColors,
    );
  });

  it('should call fadeOut after handleBgPreviousColors', () => {
    renderWithContext();
    expect(mockFadeOut).toHaveBeenCalled();
  });

  it('should re-trigger fade animation when mainColors change', () => {
    const contextValue = { ...defaultContextValue };
    let renderer: ReactTestRenderer;

    act(() => {
      renderer = create(
        <GradientContext.Provider value={contextValue}>
          <GradientWrapper>
            <Text>Child</Text>
          </GradientWrapper>
        </GradientContext.Provider>,
      );
    });

    jest.clearAllMocks();

    const updatedContext = {
      ...contextValue,
      mainColors: { primary: '#111111', secondary: '#222222' },
    };

    act(() => {
      renderer!.update(
        <GradientContext.Provider value={updatedContext}>
          <GradientWrapper>
            <Text>Child</Text>
          </GradientWrapper>
        </GradientContext.Provider>,
      );
    });

    expect(mockFadeIn).toHaveBeenCalled();
  });

  it('should render multiple children', () => {
    const renderer = renderWithContext(
      defaultContextValue,
      <>
        <Text testID="first">First</Text>
        <Text testID="second">Second</Text>
      </>,
    );
    const first = renderer.root.findByProps({ testID: 'first' });
    const second = renderer.root.findByProps({ testID: 'second' });
    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
  });

  it('should match snapshot', () => {
    const renderer = renderWithContext();
    expect(renderer.toJSON()).toMatchSnapshot();
  });
});
