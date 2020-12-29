import { useMedia } from 'snackui'

import { rgbString } from '../../helpers/rgbString'
import { useCurrentLenseColor } from './useCurrentLenseColor'

export const useSearchBarTheme = () => {
  const media = useMedia()
  const rgb = useCurrentLenseColor()
  return {
    theme: media.sm ? 'light' : 'dark',
    color: media.sm ? rgbString(rgb) ?? '#444' : '#fff',
    background: media.sm ? '#fff' : '#000',
    backgroundRgb: media.sm ? [255, 255, 255] : [20, 20, 20], //isSmall ? [255, 255, 255] : rgb,
  }
}
