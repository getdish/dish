import React, { Suspense } from 'react'
import { LoadingItem } from 'snackui'

import { useStateSynced } from '../hooks/useStateSynced'

export const SuspenseFallback = (props: { children: any; fallback?: any }) => {
  return <Suspense fallback={<FallbackRender {...props} fallback={null} />} {...props} />
}

const FallbackRender = (props: { children: any; fallback?: any }) => {
  // return <LoadingItem />
  const last = useStateSynced(props.children)
  return <>{last ?? props.fallback}</>
}

export function suspenseFallback<A extends React.FunctionComponent<any>>(Component: A): A {
  return ((props) => {
    return (
      <SuspenseFallback>
        <Component {...props} />
      </SuspenseFallback>
    )
  }) as A
}
