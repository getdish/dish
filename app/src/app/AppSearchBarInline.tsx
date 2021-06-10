import React, { Suspense } from 'react'
import { useMedia } from 'snackui'

import { AppSearchBarContents } from './AppSearchBarContents'

export const AppSearchBarInline = () => {
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
