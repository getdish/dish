import { useWindowDimensions } from 'react-native'

export const useAppMapSpotlight = ({
  overlap = 1.75,
  yPct = 0,
}: {
  overlap?: number
  yPct?: number
}) => {
  const { width, height } = useWindowDimensions()
  const minSize = Math.min(width, height)
  const size = minSize * overlap
  const adjustSide = width < height ? 'width' : 'height'
  const adjustAmt = (size - minSize) / 2
  const cx = adjustSide === 'width' ? -adjustAmt : 0
  const cy = (adjustSide !== 'width' ? -adjustAmt : 0) + (yPct / 100) * height

  return {
    cx,
    cy,
    size,
    window: { width, height },
  }
}
