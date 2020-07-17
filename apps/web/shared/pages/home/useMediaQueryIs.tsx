import { useMedia } from '@dish/ui'

export const useMediaQueryIs = () => {}
export const useMediaQueryIsReallySmall = () => useMedia({ maxWidth: 600 })
export const useMediaQueryIsSmall = () => useMedia({ maxWidth: 860 })
export const useMediaQueryIsMedium = () => useMedia({ maxWidth: 960 })
