import { searchBarHeight } from '../constants/constants'
import { AppMenuButton } from './AppMenuButton'
import { AppSearchInput } from './AppSearchInput'
import { XStack } from '@dish/ui'
import React, { memo } from 'react'

export const AppSearchBarContents = memo(() => {
  return (
    <XStack
      flex={1}
      pointerEvents="auto"
      alignItems="center"
      justifyContent="center"
      paddingHorizontal="$2"
      minHeight={searchBarHeight}
      ov="hidden"
      maxHeight={searchBarHeight}
      zi={100000}
    >
      <AppSearchInput />
      <AppMenuButton />
    </XStack>
  )
})
