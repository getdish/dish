import { StackProps, VStack } from '@dish/ui'
import React from 'react'

import { drawerBorderRadius } from '../../constants'

export const BottomSheetContainer = (props: StackProps) => {
  return (
    <VStack
      width="100%"
      height="100%"
      shadowColor="rgba(0,0,0,0.13)"
      shadowRadius={44}
      shadowOffset={{ width: 10, height: 0 }}
      borderTopRightRadius={drawerBorderRadius}
      borderTopLeftRadius={drawerBorderRadius}
      pointerEvents="auto"
      backgroundColor="#fff"
      {...props}
    />
  )
}
