import React from 'react'
import { AbsoluteVStack } from 'snackui'

import { HomeDrawerSmall } from './HomeDrawerSmall'
import { HomeStackView } from './HomeStackView'
import { HomeStackViewPages } from './HomeStackViewPages'

export function Home() {
  return (
    <AbsoluteVStack pointerEvents="none" fullscreen zIndex={1000}>
      <HomeDrawerSmall>
        <HomeStackView>
          {(props) => {
            return <HomeStackViewPages {...props} />
          }}
        </HomeStackView>
      </HomeDrawerSmall>
    </AbsoluteVStack>
  )
}
