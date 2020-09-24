import React from 'react'

import { Paragraph } from './Paragraph'
import { SizableTextProps, getSize } from './Size'

export type TitleProps = SizableTextProps

// TODO can static extract once paragraph works

export const Title = (props: TitleProps) => {
  const size = getSize(props.size ?? 'md') * 2.5
  return (
    <Paragraph
      fontWeight={size > 3.5 ? '200' : '300'}
      {...props}
      marginVertical={0}
      size={size}
      sizeLineHeight={0.7}
    />
  )
}

export const H1 = (props: TitleProps) => (
  <Title accessibilityRole="header" size="xl" {...props} />
)

export const H2 = (props: TitleProps) => (
  <Title accessibilityRole="header" size="lg" {...props} />
)

export const H3 = (props: TitleProps) => (
  <Title accessibilityRole="header" size="md" {...props} />
)

export const H4 = (props: TitleProps) => (
  <Title accessibilityRole="header" size="sm" {...props} />
)

export const H5 = (props: TitleProps) => (
  <Title accessibilityRole="header" size="xs" {...props} />
)
