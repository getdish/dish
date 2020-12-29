import React, { Suspense, useEffect } from 'react'

import { homeStore } from './HomeStore'

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
