import React from 'react'
import { HStack, StackProps, useTheme } from 'snackui'

export const ListItemHStack = (props: StackProps) => {
  const theme = useTheme()
  return (
    <HStack
      paddingVertical={12}
      paddingHorizontal={8}
      width="100%"
      alignItems="center"
      borderTopColor={theme.borderColor}
      borderTopWidth={1}
      {...props}
    >
      {props.children}
    </HStack>
  )
}
