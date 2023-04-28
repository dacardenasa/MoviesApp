import ImageColors from 'react-native-image-colors';

export const getColorsMediaFile = async (uri: string) => {
  const colors = await ImageColors.getColors(uri, {});
  let primaryColor;
  let secondaryColor;

  if (colors.platform === 'android') {
    primaryColor = colors.dominant;
    secondaryColor = colors.average;
  }
  if (colors.platform === 'ios') {
    primaryColor = colors.primary;
    secondaryColor = colors.secondary;
  }
  return [primaryColor, secondaryColor];
};
