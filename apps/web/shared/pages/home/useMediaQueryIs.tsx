import { useMedia } from '@dish/ui'

export const useMediaQueryIs = () => {}
export const useMediaQueryIsReallySmall = () => useMedia({ maxWidth: 660 })
export const useMediaQueryIsSmall = () => useMedia({ maxWidth: 860 })
export const useMediaQueryIsMedium = () => useMedia({ maxWidth: 960 })
export const useMediaQueryIsAboveMedium = () => useMedia({ minWidth: 960 })
