import React from 'react'
import { StackProps, VStack, useTheme } from 'snackui'

export const ContentSectionHoverable = (props: StackProps) => {
  const theme = useTheme()
  return (
    <VStack
      position="relative"
      width="100%"
      paddingVertical={5}
      hoverStyle={{
        backgroundColor: theme.backgroundColorAlt,
      }}
      {...props}
    />
  )
}
