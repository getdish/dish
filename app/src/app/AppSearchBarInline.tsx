import { AppSearchBarContents } from './AppSearchBarContents'
import { SquareDebug } from './views/SquareDebug'
import React, { Suspense } from 'react'

export const AppSearchBarInline = () => {
  return (
    <Suspense fallback={null}>
      <AppSearchBarContents />
    </Suspense>
  )
}
