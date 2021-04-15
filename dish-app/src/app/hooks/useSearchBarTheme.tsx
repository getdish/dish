import { useTheme } from 'snackui'
import { useMedia } from 'snackui'

import { rgbString } from '../../helpers/rgbString'
import {
  defaultLenseColor,
  defaultLenseColorDark,
  useCurrentLenseColor,
} from './useCurrentLenseColor'

export const useSearchBarTheme = () => {
  const media = useMedia()
  const color = useCurrentLenseColor()
  const theme = useTheme()
  return {
    theme: media.sm ? 'light' : color.name,
    color: media.sm ? theme.color : '#fff',
    background: media.sm ? '#fff' : rgbString(color.rgb),
    isColored: color.rgb !== defaultLenseColor.rgb && color.rgb !== defaultLenseColorDark.rgb,
    backgroundRgb: media.sm ? [255, 255, 255] : color.rgb, //isSmall ? [255, 255, 255] : rgb,
  }
}
