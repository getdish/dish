import { StackProps, VStack } from '@dish/ui'
import React from 'react'

import { drawerBorderRadius } from '../../constants'

export const HomeStackDrawer = (props: StackProps) => {
  return (
    <VStack
      flex={1}
      borderRadius={drawerBorderRadius}
      position="relative"
      backgroundColor="#fff"
      overflow="hidden"
      shadowRadius={10}
      shadowColor="rgba(0,0,0,0.1)"
      {...props}
    />
  )
}
