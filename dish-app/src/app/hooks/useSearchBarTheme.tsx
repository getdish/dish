import { useMedia } from 'snackui'

import { rgbString } from '../../helpers/rgbString'
import { defaultLenseColor, useCurrentLenseColor } from './useCurrentLenseColor'

export const useSearchBarTheme = () => {
  const media = useMedia()
  const rgb = useCurrentLenseColor()
  return {
    theme: media.sm ? 'light' : 'dark',
    color: media.sm ? rgbString(rgb) ?? '#444' : '#fff',
    background: media.sm ? '#fff' : rgbString(rgb),
    isColored: rgb !== defaultLenseColor,
    backgroundRgb: media.sm ? [255, 255, 255] : rgb, //isSmall ? [255, 255, 255] : rgb,
  }
}
