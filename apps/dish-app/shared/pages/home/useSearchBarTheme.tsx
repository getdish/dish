import { rgbString } from '../../helpers/rgbString'
import { useCurrentLenseColor } from './useCurrentLenseColor'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const useSearchBarTheme = () => {
  const isSmall = useMediaQueryIsSmall()
  const rgb = useCurrentLenseColor()
  return {
    theme: isSmall ? 'light' : 'dark',
    color: isSmall ? rgbString(rgb) ?? '#444' : '#fff',
    background: isSmall ? '#eee' : 'transparent',
    isSmall,
  }
}
