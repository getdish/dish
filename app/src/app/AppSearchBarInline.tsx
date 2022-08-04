import { AppSearchBarContents } from './AppSearchBarContents'
import { XStack } from '@dish/ui'
import React, { Suspense } from 'react'

export const AppSearchBarInline = () => {
  return (
    <Suspense fallback={null}>
      <AppSearchBarContents />
    </Suspense>
  )
}
