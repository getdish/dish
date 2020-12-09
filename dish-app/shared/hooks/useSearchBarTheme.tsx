import { rgbString } from '../helpers/rgbString'
import { useCurrentLenseColor } from './useCurrentLenseColor'
import { useIsNarrow } from './useIs'

export const useSearchBarTheme = () => {
  const isSmall = useIsNarrow()
  const rgb = useCurrentLenseColor()
  return {
    theme: isSmall ? 'light' : 'dark',
    color: '#fff', //isSmall ? rgbString(rgb) ?? '#444' : '#fff',
    background: '#000', //isSmall ? '#fff' : rgbString(rgb),
    backgroundRgb: [20, 20, 20], //isSmall ? [255, 255, 255] : rgb,
    isSmall,
  }
}
