import { IMovieCredits } from '@interfaces/index';
import { formatCastURL } from '@helpers/index';

export const transformMovieCredits = (movieCredits: IMovieCredits) => {
  return { ...movieCredits, cast: formatCastURL(movieCredits.cast) };
};
