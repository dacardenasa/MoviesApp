import React from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import { StackNavigation } from '../Navigation';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'mock-screen': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          name?: string;
          component?: React.ComponentType;
        },
        HTMLElement
      >;
      'mock-navigator': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          screenOptions?: Record<string, unknown>;
        },
        HTMLElement
      >;
    }
  }
}

jest.mock('@react-navigation/stack', () => {
  const MockScreen = ({ name, component }: any) => (
    <mock-screen name={name} component={component} />
  );
  const MockNavigator = ({ children, screenOptions }: any) => (
    <mock-navigator screenOptions={screenOptions}>{children}</mock-navigator>
  );
  return {
    createStackNavigator: () => ({
      Navigator: MockNavigator,
      Screen: MockScreen,
    }),
  };
});

jest.mock('@screens/index', () => ({
  HomeScreen: () => 'HomeScreen',
  DetailScreen: () => 'DetailScreen',
}));

describe('StackNavigation', () => {
  let renderer: ReactTestRenderer;

  beforeEach(() => {
    act(() => {
      renderer = create(<StackNavigation />);
    });
  });

  it('should render correctly', () => {
    const tree = renderer.toJSON();
    expect(tree).toBeTruthy();
  });

  it('should render a Navigator component', () => {
    const navigator = renderer.root.findByType(
      'mock-navigator' as unknown as React.ComponentClass,
    );
    expect(navigator).toBeTruthy();
  });

  it('should configure headerShown to false', () => {
    const navigator = renderer.root.findByType(
      'mock-navigator' as unknown as React.ComponentClass,
    );
    expect(navigator.props.screenOptions.headerShown).toBe(false);
  });

  it('should configure card background color to white', () => {
    const navigator = renderer.root.findByType(
      'mock-navigator' as unknown as React.ComponentClass,
    );
    expect(navigator.props.screenOptions.cardStyle).toEqual({
      backgroundColor: 'white',
    });
  });

  it('should register two screens', () => {
    const screens = renderer.root.findAllByType(
      'mock-screen' as unknown as React.ComponentClass,
    );
    expect(screens).toHaveLength(2);
  });

  it('should register HomeScreen as the first screen', () => {
    const screens = renderer.root.findAllByType(
      'mock-screen' as unknown as React.ComponentClass,
    );
    expect(screens[0].props.name).toBe('HomeScreen');
  });

  it('should register DetailScreen as the second screen', () => {
    const screens = renderer.root.findAllByType(
      'mock-screen' as unknown as React.ComponentClass,
    );
    expect(screens[1].props.name).toBe('DetailScreen');
  });

  it('should match snapshot', () => {
    expect(renderer.toJSON()).toMatchSnapshot();
  });
});
