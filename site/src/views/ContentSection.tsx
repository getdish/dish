import { Stack, StackProps, useTheme } from '@o/ui'
import React from 'react'

export const ContentSection = (props: StackProps) => {
  const theme = useTheme()
  return (
    <Stack
      className="content-section"
      padding={[16.5, '2%']}
      sm-padding={[0, 0]}
      // lg-padding={['md', 0]}
      width="100%"
      // maxWidth={760}
      fontSize={16}
      margin={[0, 'auto']}
      lineHeight={26}
      color={theme.color.setAlpha(0.85)}
      {...props}
    />
  )
}
