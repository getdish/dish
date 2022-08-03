import { AppSearchBarContents } from './AppSearchBarContents'
import { XStack } from '@dish/ui'
import React, { Suspense } from 'react'

export const AppSearchBarInline = () => {
  return (
    <XStack pr="$2">
      <Suspense fallback={null}>
        <AppSearchBarContents />
      </Suspense>
    </XStack>
  )
}
