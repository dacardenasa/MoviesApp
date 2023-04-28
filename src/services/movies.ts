import {api} from '@api/index';
import {MovieDBResponseAPI, IMovieFull, IMovieCredits} from '@interfaces/index';
import {
  transformMovieCredits,
  transformMoviesDetails,
  transformMovies,
} from '@adapters/index';

export const moviesAPI = {
  getNowPlayingMovie: async () => {
    try {
      const {data} = await api.get<MovieDBResponseAPI>('/movie/now_playing');
      const mappedResults = transformMovies(data.results);
      return {...data, results: mappedResults};
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  getPopularMovies: async () => {
    try {
      const {data} = await api.get<MovieDBResponseAPI>('/movie/popular');
      const mappedResults = transformMovies(data.results);
      return {...data, results: mappedResults};
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  getTopRatedMovies: async () => {
    try {
      const {data} = await api.get<MovieDBResponseAPI>('/movie/top_rated');
      const mappedResults = transformMovies(data.results);
      return {...data, results: mappedResults};
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  getUpcomingMovies: async () => {
    try {
      const {data} = await api.get<MovieDBResponseAPI>('/movie/upcoming');
      const mappedResults = transformMovies(data.results);
      return {...data, results: mappedResults};
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  getMovieDetails: async (movieId: number) => {
    try {
      const {data} = await api.get<IMovieFull>(`/movie/${movieId}`);
      const parsedMovieDetails = transformMoviesDetails(data);
      return parsedMovieDetails;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  getMovieCredits: async (movieId: number) => {
    try {
      const {data} = await api.get<IMovieCredits>(`/movie/${movieId}/credits`);
      const parsedMovieCredits = transformMovieCredits(data);
      return parsedMovieCredits;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
};
