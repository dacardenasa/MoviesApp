import axios from 'axios';
import Config from 'react-native-config';

export const api = axios.create({
  baseURL: Config.BASE_URL_TMDB,
  params: {
    api_key: Config.API_KEY_TMDB,
    language: 'es-ES',
  },
});
