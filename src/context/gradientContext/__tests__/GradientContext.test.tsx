import React, { useContext } from 'react';
import { create, act, ReactTestRenderer } from 'react-test-renderer';
import { Text, TouchableOpacity } from 'react-native';
import { GradientContext, GradientProvider } from '../index';

const TestConsumer = () => {
  const {
    mainColors,
    previousColors,
    handleBgMainColors,
    handleBgPreviousColors,
  } = useContext(GradientContext);

  return (
    <>
      <Text testID="mainPrimary">{mainColors.primary}</Text>
      <Text testID="mainSecondary">{mainColors.secondary}</Text>
      <Text testID="prevPrimary">{previousColors.primary}</Text>
      <Text testID="prevSecondary">{previousColors.secondary}</Text>
      <TouchableOpacity
        testID="setMain"
        onPress={() =>
          handleBgMainColors({ primary: '#FF0000', secondary: '#00FF00' })
        }
      />
      <TouchableOpacity
        testID="setPrevious"
        onPress={() =>
          handleBgPreviousColors({ primary: '#0000FF', secondary: '#FFFF00' })
        }
      />
    </>
  );
};

describe('GradientContext', () => {
  let renderer: ReactTestRenderer;

  it('should render children', () => {
    act(() => {
      renderer = create(
        <GradientProvider>
          <Text>Child</Text>
        </GradientProvider>,
      );
    });
    const text = renderer.root.findByType(Text);
    expect(text.props.children).toBe('Child');
  });

  it('should provide transparent as default mainColors', () => {
    act(() => {
      renderer = create(
        <GradientProvider>
          <TestConsumer />
        </GradientProvider>,
      );
    });
    const mainPrimary = renderer.root.findByProps({ testID: 'mainPrimary' });
    const mainSecondary = renderer.root.findByProps({
      testID: 'mainSecondary',
    });
    expect(mainPrimary.props.children).toBe('transparent');
    expect(mainSecondary.props.children).toBe('transparent');
  });

  it('should provide transparent as default previousColors', () => {
    act(() => {
      renderer = create(
        <GradientProvider>
          <TestConsumer />
        </GradientProvider>,
      );
    });
    const prevPrimary = renderer.root.findByProps({ testID: 'prevPrimary' });
    const prevSecondary = renderer.root.findByProps({
      testID: 'prevSecondary',
    });
    expect(prevPrimary.props.children).toBe('transparent');
    expect(prevSecondary.props.children).toBe('transparent');
  });

  it('should update mainColors when handleBgMainColors is called', () => {
    act(() => {
      renderer = create(
        <GradientProvider>
          <TestConsumer />
        </GradientProvider>,
      );
    });

    const setMainButton = renderer.root.findByProps({ testID: 'setMain' });
    act(() => {
      setMainButton.props.onPress();
    });

    const mainPrimary = renderer.root.findByProps({ testID: 'mainPrimary' });
    const mainSecondary = renderer.root.findByProps({
      testID: 'mainSecondary',
    });
    expect(mainPrimary.props.children).toBe('#FF0000');
    expect(mainSecondary.props.children).toBe('#00FF00');
  });

  it('should update previousColors when handleBgPreviousColors is called', () => {
    act(() => {
      renderer = create(
        <GradientProvider>
          <TestConsumer />
        </GradientProvider>,
      );
    });

    const setPreviousButton = renderer.root.findByProps({
      testID: 'setPrevious',
    });
    act(() => {
      setPreviousButton.props.onPress();
    });

    const prevPrimary = renderer.root.findByProps({ testID: 'prevPrimary' });
    const prevSecondary = renderer.root.findByProps({
      testID: 'prevSecondary',
    });
    expect(prevPrimary.props.children).toBe('#0000FF');
    expect(prevSecondary.props.children).toBe('#FFFF00');
  });

  it('should update mainColors without affecting previousColors', () => {
    act(() => {
      renderer = create(
        <GradientProvider>
          <TestConsumer />
        </GradientProvider>,
      );
    });

    const setMainButton = renderer.root.findByProps({ testID: 'setMain' });
    act(() => {
      setMainButton.props.onPress();
    });

    const prevPrimary = renderer.root.findByProps({ testID: 'prevPrimary' });
    const prevSecondary = renderer.root.findByProps({
      testID: 'prevSecondary',
    });
    expect(prevPrimary.props.children).toBe('transparent');
    expect(prevSecondary.props.children).toBe('transparent');
  });

  it('should update previousColors without affecting mainColors', () => {
    act(() => {
      renderer = create(
        <GradientProvider>
          <TestConsumer />
        </GradientProvider>,
      );
    });

    const setPreviousButton = renderer.root.findByProps({
      testID: 'setPrevious',
    });
    act(() => {
      setPreviousButton.props.onPress();
    });

    const mainPrimary = renderer.root.findByProps({ testID: 'mainPrimary' });
    const mainSecondary = renderer.root.findByProps({
      testID: 'mainSecondary',
    });
    expect(mainPrimary.props.children).toBe('transparent');
    expect(mainSecondary.props.children).toBe('transparent');
  });

  it('should handle multiple children', () => {
    act(() => {
      renderer = create(
        <GradientProvider>
          <Text testID="first">First</Text>
          <Text testID="second">Second</Text>
        </GradientProvider>,
      );
    });
    const first = renderer.root.findByProps({ testID: 'first' });
    const second = renderer.root.findByProps({ testID: 'second' });
    expect(first).toBeTruthy();
    expect(second).toBeTruthy();
  });
});
