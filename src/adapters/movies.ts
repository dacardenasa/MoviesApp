import { Movie } from 'interfaces';
import Config from 'react-native-config';

export const transformMovies = (movies: Movie[]) => {
  return movies.map(movie => {
    const poster_path = movie?.poster_path
      ? Config.BASE_URL_TMDB_IMAGE.concat(movie.poster_path)
      : null;
    return { ...movie, poster_path };
  });
};
