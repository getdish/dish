import { useMediaLayout } from '@o/ui'

import { widths } from '../constants'

type ScreenSize = 'small' | 'medium' | 'large'

export const sizes = {
  tiny: { maxWidth: widths.xs },
  small: { maxWidth: widths.sm },
  medium: { minWidth: widths.md },
  large: { minWidth: widths.lg },
  short: { maxHeight: 900 },
}

export function useIsTiny(): boolean {
  return useMediaLayout(sizes.tiny)
}

const getSize = ([isSmall, isMedium, isLarge]: any): ScreenSize => {
  return isLarge ? 'large' : isMedium ? 'medium' : isSmall ? 'small' : 'small'
}

export function useScreenSize(
  options: {
    onChange?: (size: ScreenSize) => any
  } = {},
): ScreenSize | undefined {
  const res = useMediaLayout([sizes.small, sizes.medium, sizes.large], {
    ...options,
    onChange: options.onChange ? x => options.onChange(getSize(x)) : null,
  })
  if (!options || !options.onChange) {
    return getSize(res)
  }
}

export function useScreenHeight(): 'short' | 'medium' {
  const [isShort, isSmall] = useMediaLayout([sizes.short, sizes.small])
  // only return "short" if its "fat" ie wider than it is tall
  return isShort && !isSmall ? 'short' : 'medium'
}

export const useScreenHeightVal = (short: any, normal: any) => {
  const screen = useScreenHeight()
  return screen === 'short' ? short : normal
}
