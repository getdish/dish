import React, { useEffect } from 'react'

import { homeStore } from '../homeStore'
import { SuspenseFallback } from '../views/SuspenseFallback'

export function HomeSuspense(props: { children: any; fallback?: any }) {
  return (
    <SuspenseFallback fallback={<PageLoading fallback={props.fallback} />}>
      {props.children}
    </SuspenseFallback>
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
