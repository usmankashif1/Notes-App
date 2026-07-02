import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// const guidelineBaseWidth = 375;
const guidelineBaseWidth = 390;
// const guidelineBaseHeight = 812;
const guidelineBaseHeight = 844;

export const RW = size => (SCREEN_WIDTH / guidelineBaseWidth) * size;

export const RH = size => (SCREEN_HEIGHT / guidelineBaseHeight) * size;

export const RF = size => {
  const scale = SCREEN_WIDTH / guidelineBaseWidth;
  return PixelRatio.roundToNearestPixel(size * scale);
};

export const RS = size => {
  const scaleWidth = SCREEN_WIDTH / guidelineBaseWidth;
  const scaleHeight = SCREEN_HEIGHT / guidelineBaseHeight;
  const scale = Math.min(scaleWidth, scaleHeight);
  return PixelRatio.roundToNearestPixel(size * scale);
};
