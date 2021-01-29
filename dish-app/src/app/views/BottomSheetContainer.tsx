import React from 'react'
import { VStack, useTheme } from 'snackui'

import { drawerBorderRadius } from '../../constants/constants'
import AppAutocomplete from '../AppAutocomplete'
import { DrawerPortalProvider } from '../Portal'

// only renders on small views

export const BottomSheetContainer = (props: { children: any }) => {
  const theme = useTheme()
  return (
    <VStack
      width="100%"
      height="100%"
      shadowColor="rgba(0,0,0,0.25)"
      shadowRadius={34}
      shadowOffset={{ width: 10, height: 0 }}
      borderTopRightRadius={drawerBorderRadius}
      borderTopLeftRadius={drawerBorderRadius}
      pointerEvents="auto"
      backgroundColor={theme.backgroundColor}
      position="relative"
    >
      <DrawerPortalProvider />
      <AppAutocomplete />
      {props.children}
    </VStack>
  )
}
