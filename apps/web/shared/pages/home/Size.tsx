import { TextProps } from '@dish/ui'

export type Size = number | SizeName

export type SizeName =
  | 'xxxs'
  | 'xxs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'xxxl'

export type SizableTextProps = TextProps & {
  size?: Size
  sizeLineHeight?: number
}

const sizes = {
  xxxs: 0.25,
  xxs: 0.5,
  xs: 0.75,
  sm: 0.9,
  md: 1,
  lg: 1.1,
  xl: 1.25,
  xxl: 1.5,
  xxxl: 1.75,
}

export const getSize = (size: Size): number => {
  if (typeof size === 'string') return sizes[size]
  return size ?? 1
}
