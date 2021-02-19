import React from 'react'
import { VStack, useTheme } from 'snackui'

import { drawerBorderRadius } from '../../constants/constants'
import {
  AppAutocompleteLocation,
  AppAutocompleteSearch,
} from '../AppAutocomplete'
import { DrawerPortalProvider } from '../Portal'

// only renders on small views

export const BottomSheetContainer = (props: { children: any }) => {
  const theme = useTheme()
  return (
    <VStack
      width="100%"
      height="100%"
      flex={1}
      shadowColor="rgba(0,0,0,0.15)"
      shadowRadius={28}
      shadowOffset={{ width: 10, height: 0 }}
      borderTopRightRadius={drawerBorderRadius}
      borderTopLeftRadius={drawerBorderRadius}
      pointerEvents="auto"
      backgroundColor={theme.backgroundColor}
      position="relative"
    >
      <DrawerPortalProvider />
      <AppAutocompleteLocation />
      <AppAutocompleteSearch />
      {props.children}
    </VStack>
  )
}
