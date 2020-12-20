import { Dimensions } from 'react-native'
import { useMedia } from 'snackui'

export const cardFrameWidth = 240
export const cardFrameHeight = 340

// TODO tricky snackui extraction
export const useCardFrame = () => {
  const media = useMedia()

  if (media.xs) {
    const { width, height } = Dimensions.get('window')
    const cardWidth = width - 30
    return {
      width: cardWidth,
      height: Math.min(cardWidth * 1.2, height - 80),
    }
  }

  return {
    width: cardFrameWidth,
    height: cardFrameHeight,
  }
}
