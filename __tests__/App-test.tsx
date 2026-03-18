/**
 * @format
 */

import 'react-native';
import React from 'react';
import renderer, { act, ReactTestRenderer } from 'react-test-renderer';

jest.mock('react-native-image-colors', () => ({
  getColors: jest.fn().mockResolvedValue({
    platform: 'ios',
    dominant: '#FFFFFF',
    background: '#000000',
    primary: '#FFFFFF',
    secondary: '#000000',
    detail: '#FFFFFF',
  }),
}));

jest.mock('react-native-snap-carousel', () => {
  const { View } = require('react-native');
  return View;
});

jest.mock('../src/services/movies', () => ({
  moviesAPI: {
    getNowPlayingMovie: jest.fn().mockResolvedValue({ results: [] }),
    getPopularMovies: jest.fn().mockResolvedValue({ results: [] }),
    getTopRatedMovies: jest.fn().mockResolvedValue({ results: [] }),
    getUpcomingMovies: jest.fn().mockResolvedValue({ results: [] }),
  },
}));

import App from '../App';

jest.useFakeTimers();

it('renders correctly', async () => {
  let tree: ReactTestRenderer | undefined;
  await act(async () => {
    tree = renderer.create(<App />);
  });
  await act(async () => {
    jest.runAllTimers();
  });
  await act(async () => {
    tree?.unmount();
  });
});
