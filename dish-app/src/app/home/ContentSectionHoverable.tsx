import React from 'react'
import { StackProps, VStack, useTheme } from 'snackui'

export const ContentSectionHoverable = (props: StackProps) => {
  const theme = useTheme()
  return (
    <VStack
      className="testme123"
      position="relative"
      width="100%"
      paddingVertical={7}
      hoverStyle={{
        backgroundColor: theme.backgroundColorAlt,
      }}
      {...props}
    />
  )
}
