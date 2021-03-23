import { FullScreen } from '@o/ui'
import React, { useEffect, useLayoutEffect, useState } from 'react'

import { BrandMark } from '../views/LogoVertical'

export function LoadingPage({ loading }: { loading: boolean }) {
  return (
    <FullScreen
      transition="all ease 300ms"
      opacity={1}
      background={(theme) => theme.background}
      zIndex={10000000}
      position="fixed"
      alignItems="center"
      justifyContent="center"
      {...(!loading && {
        opacity: 0,
        pointerEvents: 'none',
      })}
    >
      <BrandMark />
    </FullScreen>
  )
}
