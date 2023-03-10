import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {moviesAPI} from '@services/index';
import {Movie} from '@interfaces/index';

interface IMoviesState {
  nowPlaying: Movie[];
  popular: Movie[];
  topRated: Movie[];
  upcoming: Movie[];
}

export const useMovies = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [moviesState, setMoviesState] = useState<IMoviesState>({
    nowPlaying: [],
    popular: [],
    topRated: [],
    upcoming: [],
  });

  const getMovies = async () => {
    const nowPlayingPromise = moviesAPI.getNowPlayingMovie();
    const popularPromise = moviesAPI.getPopularMovies();
    const topRatedPromise = moviesAPI.getTopRatedMovies();
    const upcomingPromise = moviesAPI.getUpcomingMovies();

    const [nowPlayingMovies, popularMovies, topRatedMovies, upcomingMovies] =
      await Promise.all([
        nowPlayingPromise,
        popularPromise,
        topRatedPromise,
        upcomingPromise,
      ]);

    setMoviesState({
      nowPlaying: nowPlayingMovies.results,
      popular: popularMovies.results,
      topRated: topRatedMovies.results,
      upcoming: upcomingMovies.results,
    });
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      getMovies();
      return () => null;
    }, []),
  );

  return {
    ...moviesState,
    isLoading,
  };
};
