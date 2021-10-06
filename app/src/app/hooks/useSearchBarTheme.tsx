import { useTheme } from 'snackui'
import { useMedia } from 'snackui'

import { rgbString } from '../../helpers/rgb'
import {
  defaultLenseColor,
  defaultLenseColorDark,
  useCurrentLenseColor,
} from './useCurrentLenseColor'

export const useSearchBarTheme = () => {
  const media = useMedia()
  const color = useCurrentLenseColor()
  const theme = useTheme()
  const isColored = color.rgb !== defaultLenseColor.rgb && color.rgb !== defaultLenseColorDark.rgb
  if (media.sm) {
    return {
      themeName: 'light',
      color: theme.color,
      background: '#fff',
      isColored: color.rgb !== defaultLenseColor.rgb && color.rgb !== defaultLenseColorDark.rgb,
      backgroundRgb: [255, 255, 255],
    }
  }
  return {
    themeName: theme.name === 'dark' ? 'darkTranslucent' : 'lightTranslucent',
    color: color.rgb[0] === 255 ? '#000' : '#fff',
    background: isColored ? rgbString(color.rgb, 1) : rgbString(color.rgb),
    isColored,
    backgroundRgb: color.rgb,
  }
}
