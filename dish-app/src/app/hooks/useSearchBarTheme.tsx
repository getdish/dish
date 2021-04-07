import { useMedia } from 'snackui'

import { rgbString } from '../../helpers/rgbString'
import { defaultLenseColor, useCurrentLenseColor } from './useCurrentLenseColor'

export const useSearchBarTheme = () => {
  const media = useMedia()
  const color = useCurrentLenseColor()
  return {
    theme: media.sm ? 'light' : 'dark',
    color: media.sm ? rgbString(color.rgb) ?? '#444' : '#fff',
    background: media.sm ? '#fff' : rgbString(color.rgb),
    isColored: color.rgb !== defaultLenseColor.rgb,
    backgroundRgb: media.sm ? [255, 255, 255] : color.rgb, //isSmall ? [255, 255, 255] : rgb,
  }
}
