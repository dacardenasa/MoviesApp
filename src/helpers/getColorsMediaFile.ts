import {PLATFORMS} from 'constants/global';
import ImageColors from 'react-native-image-colors';

export const getColorsMediaFile = async (uri: string) => {
  const colors = await ImageColors.getColors(uri, {});
  let primaryColor;
  let secondaryColor;

  if (colors.platform === PLATFORMS.ANDROID) {
    primaryColor = colors.dominant;
    secondaryColor = colors.average;
  }
  if (colors.platform === PLATFORMS.IOS) {
    primaryColor = colors.primary;
    secondaryColor = colors.secondary;
  }
  return [primaryColor, secondaryColor];
};
