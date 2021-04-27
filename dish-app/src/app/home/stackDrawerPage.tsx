import { fullyIdle, series } from '@dish/async'
import React, { useEffect, useState } from 'react'

import { StackDrawer } from '../views/StackDrawer'
import { StackDrawerProps } from '../views/StackDrawerContents'

export function stackDrawerPage<A = any>(Component: A, stackProps: StackDrawerProps): A {
  const hoc = (props: StackDrawerProps) => {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
      return series([
        // dont show right away to get animation
        () => fullyIdle({ max: 120, min: 80 }),
        () => setIsLoaded(true),
      ])
    }, [])

    return (
      <StackDrawer {...stackProps}>
        {isLoaded ? null : React.createElement(Component as any, props)}
      </StackDrawer>
    )
  }
  return hoc as any
}
