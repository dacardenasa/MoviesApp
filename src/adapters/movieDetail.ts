import {IMovieFull} from 'interfaces';
import {formatCurrency} from 'react-native-format-currency';

export const transformMoviesDetails = (movie: IMovieFull) => {
  const [, valueFormattedWithoutSymbol, symbol] = formatCurrency({
    amount: +movie.budget,
    code: 'USD',
  });
  return {
    ...movie,
    budget:
      movie.budget === 0
        ? 'Pelicula sin informacion de Presupuesto'
        : `${symbol + valueFormattedWithoutSymbol}`,
  };
};
