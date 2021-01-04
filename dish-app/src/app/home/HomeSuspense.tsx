import React, { Suspense, useEffect } from 'react'

import { homeStore } from '../homeStore'

export function HomeSuspense(props: { children: any; fallback?: any }) {
  return (
    <Suspense fallback={<PageLoading fallback={props.fallback} />}>
      {props.children}
    </Suspense>
  )
}

function PageLoading({ fallback }: { fallback?: any }) {
  useEffect(() => {
    homeStore.setLoading(true)
    return () => {
      homeStore.setLoading(false)
    }
  }, [])

  return fallback ?? null
}
