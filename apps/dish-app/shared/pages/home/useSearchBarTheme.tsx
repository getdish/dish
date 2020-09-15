import { rgbString } from '../../helpers/rgbString'
import { useCurrentLenseColor } from './useCurrentLenseColor'
import { useIsNarrow } from './useIs'

export const useSearchBarTheme = () => {
  const isSmall = useIsNarrow()
  const rgb = useCurrentLenseColor()
  return {
    theme: isSmall ? 'light' : 'dark',
    color: isSmall ? rgbString(rgb) ?? '#444' : '#fff',
    background: isSmall ? '#eee' : 'transparent',
    isSmall,
  }
}
