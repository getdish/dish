import React from 'react'
import { StackProps, VStack, useTheme } from 'snackui'

export const ContentSectionHoverable = (props: StackProps) => {
  // const theme = useTheme()
  return (
    <VStack
      position="relative"
      width="100%"
      hoverStyle={{
        backgroundColor: 'rgba(150,150,150,0.05)',
      }}
      {...props}
    />
  )
}
