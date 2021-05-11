import React from 'react'
import { AbsoluteVStack } from 'snackui'

import { HomeDrawerSmallView } from './HomeDrawerSmallView'
import { HomeStackView } from './HomeStackView'
import { HomeStackViewPages } from './HomeStackViewPages'

export function Home() {
  return (
    <AbsoluteVStack pointerEvents="none" fullscreen zIndex={1000}>
      <HomeDrawerSmallView>
        <HomeStackView>
          {(props) => {
            return <HomeStackViewPages {...props} />
          }}
        </HomeStackView>
      </HomeDrawerSmallView>
    </AbsoluteVStack>
  )
}
