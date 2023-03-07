import {useFocusEffect} from '@react-navigation/native';
import {useState, useCallback} from 'react';
import {moviesAPI} from '@services/index';
import {Cast, IMovieFull} from 'interfaces';

interface IMovieExtraInfo {
  isLoading: boolean;
  movieDetails?: IMovieFull;
  cast: Cast[];
}

export const useMovieDetails = ({movieId}: {movieId: number}) => {
  const [movieExtraInfo, setMovieExtraInfo] = useState<IMovieExtraInfo>({
    isLoading: true,
    movieDetails: undefined,
    cast: [],
  });

  const getMovieExtraInfo = async () => {
    const movieDetailsPromise = moviesAPI.getMovieDetails(movieId);
    const movieCreditsPromise = moviesAPI.getMovieCredits(movieId);
    const [movieDetails, movieCredits] = await Promise.all([
      movieDetailsPromise,
      movieCreditsPromise,
    ]);
    setMovieExtraInfo({
      isLoading: false,
      movieDetails,
      cast: movieCredits.cast,
    });
  };

  useFocusEffect(
    useCallback(() => {
      getMovieExtraInfo();
      return () => null;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  return {
    ...movieExtraInfo,
  };
};
