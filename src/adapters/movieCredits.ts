import {Cast, IMovieCredits} from 'interfaces';
import Config from 'react-native-config';

const formatCastURL = (casts: Cast[]) => {
  return casts.map(cast => {
    const profile_path = cast?.profile_path
      ? Config.BASE_URL_TMDB_IMAGE.concat(cast?.profile_path)
      : null;
    return {...cast, profile_path};
  });
};

export const transformMovieCredits = (movieCredits: IMovieCredits) => {
  return {...movieCredits, cast: formatCastURL(movieCredits.cast)};
};
