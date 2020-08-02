import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const useSearchBarTheme = () => {
  const isSmall = useMediaQueryIsSmall()
  return {
    theme: isSmall ? 'light' : 'dark',
    color: isSmall ? '#444' : '#fff',
    background: isSmall ? '#eee' : 'transparent',
    isSmall,
  }
}
