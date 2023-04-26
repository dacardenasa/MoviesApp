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
  const [hasAnyError, setHasAnyError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [moviesState, setMoviesState] = useState<IMoviesState>({
    nowPlaying: [],
    popular: [],
    topRated: [],
    upcoming: [],
  });

  const getMovies = useCallback(async () => {
    const nowPlayingPromise = moviesAPI.getNowPlayingMovie();
    const popularPromise = moviesAPI.getPopularMovies();
    const topRatedPromise = moviesAPI.getTopRatedMovies();
    const upcomingPromise = moviesAPI.getUpcomingMovies();
    try {
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
      if (hasAnyError) {
        setHasAnyError(false);
      }
    } catch (error: any) {
      setHasAnyError(true);
      setIsLoading(false);
    }
  }, [hasAnyError]);

  const handleGetMovies = () => {
    setIsLoading(true);
    getMovies();
  };

  useFocusEffect(
    useCallback(() => {
      getMovies();
      return () => null;
    }, [getMovies]),
  );

  return {
    ...moviesState,
    isLoading,
    hasAnyError,
    handleGetMovies,
  };
};
