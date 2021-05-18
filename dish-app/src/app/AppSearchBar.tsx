import React, { Suspense } from 'react'
import { VStack, useMedia } from 'snackui'

import { AppSearchBarContents } from './AppSearchBarContents'

export const AppSearchBar = () => {
  const media = useMedia()
  if (!media.sm) {
    return null
  }
  return (
    <Suspense fallback={null}>
      <AppSearchBarContents isColored={false} />
    </Suspense>
  )
}
