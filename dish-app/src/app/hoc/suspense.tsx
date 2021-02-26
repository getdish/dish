import React, { Suspense } from 'react'

export function suspense<
  A extends React.FunctionComponent<any>,
  Props = A extends React.FunctionComponent<infer Props> ? Props : never
>(Component: A, fallback: ((props: Props) => any) | any): A {
  return ((props) => {
    return (
      <Suspense
        fallback={typeof fallback === 'function' ? fallback(props) : fallback}
      >
        <Component {...props} />
      </Suspense>
    )
  }) as A
}
