import React from 'react'
import { StackProps, VStack, useTheme } from 'snackui'

export const ContentSectionHoverable = (props: StackProps) => {
  const theme = useTheme()

  return (
    <VStack
      position="relative"
      width="100%"
      paddingTop={20}
      marginTop={-20}
      marginBottom={10}
      hoverStyle={{
        backgroundColor: theme.backgroundColorAlt,
      }}
      {...props}
    />
  )
}
