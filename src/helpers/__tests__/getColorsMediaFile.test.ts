import { getColorsMediaFile } from '../getColorsMediaFile';
import ImageColors from 'react-native-image-colors';

jest.mock('react-native-image-colors', () => ({
  getColors: jest.fn(),
}));

const mockGetColors = ImageColors.getColors as jest.Mock;

describe('getColorsMediaFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call ImageColors.getColors with the uri and empty options', async () => {
    mockGetColors.mockResolvedValue({
      platform: 'ios',
      primary: '#FF0000',
      secondary: '#00FF00',
    });
    await getColorsMediaFile('https://example.com/image.jpg');
    expect(mockGetColors).toHaveBeenCalledWith(
      'https://example.com/image.jpg',
      {},
    );
  });

  it('should return primary and secondary colors for iOS', async () => {
    mockGetColors.mockResolvedValue({
      platform: 'ios',
      primary: '#FF0000',
      secondary: '#00FF00',
    });
    const result = await getColorsMediaFile('https://example.com/image.jpg');
    expect(result).toEqual(['#FF0000', '#00FF00']);
  });

  it('should return dominant and average colors for Android', async () => {
    mockGetColors.mockResolvedValue({
      platform: 'android',
      dominant: '#0000FF',
      average: '#FFFF00',
    });
    const result = await getColorsMediaFile('https://example.com/image.jpg');
    expect(result).toEqual(['#0000FF', '#FFFF00']);
  });

  it('should return undefined colors for unsupported platform', async () => {
    mockGetColors.mockResolvedValue({
      platform: 'web',
    });
    const result = await getColorsMediaFile('https://example.com/image.jpg');
    expect(result).toEqual([undefined, undefined]);
  });
});
