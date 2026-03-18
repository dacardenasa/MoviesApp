import { Cast } from '@interfaces/index';
import Config from 'react-native-config';

export const formatCastURL = (casts: Cast[]) => {
  return casts.map(cast => {
    const profile_path = cast?.profile_path
      ? Config.BASE_URL_TMDB_IMAGE.concat(cast?.profile_path)
      : null;
    return { ...cast, profile_path };
  });
};
