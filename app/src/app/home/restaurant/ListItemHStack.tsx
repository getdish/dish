import { StackProps, XStack, useTheme } from '@dish/ui'
import React from 'react'

export const ListItemXStack = (props: StackProps) => {
  const theme = useTheme()
  return (
    <XStack
      paddingVertical={12}
      paddingHorizontal={8}
      width="100%"
      alignItems="center"
      borderTopColor={theme.borderColor}
      borderTopWidth={1}
      {...props}
    >
      {props.children}
    </XStack>
  )
}
