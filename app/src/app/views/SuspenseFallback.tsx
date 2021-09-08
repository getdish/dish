// @ts-ignore
import React, { Suspense, SuspenseProps } from 'react'

export const SuspenseFallback = (props: Partial<SuspenseProps>) => {
  return (
    <>
      <Suspense fallback={null} {...props} />
    </>
  )
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
