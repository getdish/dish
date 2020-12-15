import { Dimensions } from 'react-native'

import { useIsReallyNarrow } from '../../hooks/useIs'

export const cardFrameWidth = 240
export const cardFrameHeight = 340

export const useCardFrame = () => {
  const isReallyNarrow = useIsReallyNarrow()

  if (isReallyNarrow) {
    const { width, height } = Dimensions.get('window')
    const cardWidth = width - 30
    return {
      isReallyNarrow,
      width: cardWidth,
      height: Math.min(cardWidth * 1.2, height - 80),
    }
  }

  return {
    isReallyNarrow,
    width: cardFrameWidth,
    height: cardFrameHeight,
  }
}
