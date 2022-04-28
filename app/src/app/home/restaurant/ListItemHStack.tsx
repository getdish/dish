import { XStack, YStackProps } from '@dish/ui'
import React from 'react'

export const ListItemXStack = (props: YStackProps) => {
  return (
    <XStack
      paddingVertical={12}
      paddingHorizontal={8}
      width="100%"
      alignItems="center"
      borderTopColor="$borderColor"
      borderTopWidth={1}
      {...props}
    >
      {props.children}
    </XStack>
  )
}
