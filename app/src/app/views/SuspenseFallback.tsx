import React, { Suspense } from 'react'
import { LoadingItem } from 'snackui'

import { useStateSynced } from '../hooks/useStateSynced'

export type SuspenseFallbackProps = { children: any; fallback?: any }

export const SuspenseFallback = (props: SuspenseFallbackProps) => {
  // disbaled for now
  return <Suspense fallback={null} {...props} />
}

// disabled needs to happen in react otherwise we have to compare deep trees every render

// const FallbackRender = (props: SuspenseFallbackProps) => {
//   const last = useStateSynced(props.children)
//   const children = last ?? props.fallback

//   if (typeof children === 'function') {
//     console.error('got children as function', props, last)
//     return null
//   }

//   return <>{children}</>
// }

export function suspenseFallback<A extends React.FunctionComponent<any>>(Component: A): A {
  return ((props) => {
    return (
      <SuspenseFallback>
        <Component {...props} />
      </SuspenseFallback>
    )
  }) as A
}
