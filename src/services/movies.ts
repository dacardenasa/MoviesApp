import { api } from '@api/index';
import {
  MovieDBResponseAPI,
  IMovieFull,
  IMovieCredits,
} from '@interfaces/index';
import {
  transformMovieCredits,
  transformMoviesDetails,
  transformMovies,
} from '@adapters/index';

export const moviesAPI = {
  getNowPlayingMovie: async () => {
    try {
      const { data } = await api.get<MovieDBResponseAPI>('/movie/now_playing');
      const mappedResults = transformMovies(data.results);
      return { ...data, results: mappedResults };
    } catch {
      throw new Error('Error al obtener las películas en cartelera');
    }
  },
  getPopularMovies: async () => {
    try {
      const { data } = await api.get<MovieDBResponseAPI>('/movie/popular');
      const mappedResults = transformMovies(data.results);
      return { ...data, results: mappedResults };
    } catch {
      throw new Error('Error al obtener las películas populares');
    }
  },
  getTopRatedMovies: async () => {
    try {
      const { data } = await api.get<MovieDBResponseAPI>('/movie/top_rated');
      const mappedResults = transformMovies(data.results);
      return { ...data, results: mappedResults };
    } catch {
      throw new Error('Error al obtener las películas mejor valoradas');
    }
  },
  getUpcomingMovies: async () => {
    try {
      const { data } = await api.get<MovieDBResponseAPI>('/movie/upcoming');
      const mappedResults = transformMovies(data.results);
      return { ...data, results: mappedResults };
    } catch {
      throw new Error('Error al obtener las próximas películas');
    }
  },
  getMovieDetails: async (movieId: number) => {
    try {
      const { data } = await api.get<IMovieFull>(`/movie/${movieId}`);
      const parsedMovieDetails = transformMoviesDetails(data);
      return parsedMovieDetails;
    } catch {
      throw new Error('Error al obtener los detalles de la película');
    }
  },
  getMovieCredits: async (movieId: number) => {
    try {
      const { data } = await api.get<IMovieCredits>(
        `/movie/${movieId}/credits`,
      );
      const parsedMovieCredits = transformMovieCredits(data);
      return parsedMovieCredits;
    } catch {
      throw new Error('Error al obtener los créditos de la película');
    }
  },
};
