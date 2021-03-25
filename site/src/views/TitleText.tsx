import { Title, TitleProps, getSizeRelative } from '@o/ui'
import React from 'react'

export const TitleText = ({
  sizeRelative = 0,
  ...props
}: TitleProps & {
  sizeRelative?: number
}) => {
  // automatically do a small size
  const size = props.size || 'lg'
  const smSize =
    props['sm-size'] ||
    (typeof size === 'string' ? getSizeRelative(size as any, -2 + sizeRelative) : size)
  const mdSize =
    props['md-size'] ||
    (typeof size === 'string' ? getSizeRelative(size as any, -1 + sizeRelative) : size)
  return (
    <Title fontWeight={800} selectable {...props} size={size} sm-size={smSize} md-size={mdSize} />
  )
}
