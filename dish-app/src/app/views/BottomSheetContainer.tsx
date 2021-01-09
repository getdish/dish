import React from 'react'
import { VStack, useTheme } from 'snackui'

import { drawerBorderRadius } from '../../constants/constants'
import AppAutocomplete from '../AppAutocomplete'

// only renders on small views

export const BottomSheetContainer = (props: { children: any }) => {
  const theme = useTheme()
  return (
    <VStack
      width="100%"
      height="100%"
      shadowColor="rgba(0,0,0,0.15)"
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
