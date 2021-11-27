import React, { Suspense } from 'react'

import { AppSearchBarContents } from './AppSearchBarContents'

export const AppSearchBarInline = () => {
  return (
    <Suspense fallback={null}>
      <AppSearchBarContents />
    </Suspense>
  )
}
