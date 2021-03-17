import sepFilled from '!raw-loader!../../public/images/line-sep-filled.svg'
import sep from '!raw-loader!../../public/images/line-sep.svg'
import { useTheme, View, ViewProps } from '@o/ui'
import React from 'react'

export function LineSep({
  fill = null,
  noOverlay = false,
  ...props
}: ViewProps & {
  fill?: any
  noOverlay?: boolean
}) {
  const theme = useTheme()
  let svg = fill
    ? sepFilled.replace(
        'fill="#000000"',
        `fill="${fill === true ? theme.background.toHexString() : fill}"`,
      )
    : sep
  if (noOverlay) {
    svg = svg.replace(`fill="url(#linearGradient-1)"`, '')
  }
  return (
    <View color={theme.background} position="absolute" top={0} width="100%" height={100} {...props}>
      <svg width="100%" dangerouslySetInnerHTML={{ __html: svg }} />
    </View>
  )
}
