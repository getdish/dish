import React from 'react'
import { VStack, useTheme } from 'snackui'

import AppAutocomplete from './AppAutocomplete'
import { drawerBorderRadius } from './constants'

export const BottomSheetContainer = (props: { children: any }) => {
  const theme = useTheme()
  return (
    <VStack
      width="100%"
      height="100%"
      shadowColor="rgba(0,0,0,0.1)"
      shadowRadius={34}
      shadowOffset={{ width: 10, height: 0 }}
      borderTopRightRadius={drawerBorderRadius}
      borderTopLeftRadius={drawerBorderRadius}
      pointerEvents="auto"
      backgroundColor={theme.backgroundColor}
      position="relative"
    >
      <AppAutocomplete />
      {props.children}
    </VStack>
  )
}
