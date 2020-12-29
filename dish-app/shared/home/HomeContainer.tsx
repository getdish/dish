import React from 'react'
// import { createReparentableSpace } from 'react-reparenting'
import { AbsoluteVStack, useMedia } from 'snackui'

import { HomeDrawerSmall } from './HomeDrawerSmall'
import { zIndexDrawer } from '../constants/constants'
import { HomeContainerLarge } from './HomeContainerLarge'

// const { Reparentable, sendReparentableChild } = createReparentableSpace()

export function HomeContainer(props: { children: any }) {
  const media = useMedia()
  // const [parent, setParent] = useState(() => (media.sm ? 'sm' : 'lg'))
  // const children = [<React.Fragment key="1">{props.children}</React.Fragment>]

  console.log('home container?')

  // useLayoutEffect(() => {
  //   setParent((last) => {
  //     const next = media.sm ? 'sm' : 'lg'
  //     sendReparentableChild(last, next, 0, 0)
  //     return next
  //   })
  // }, [media.sm])

  return (
    <AbsoluteVStack fullscreen pointerEvents="none" zIndex={zIndexDrawer}>
      {media.sm && <HomeDrawerSmall>{props.children}</HomeDrawerSmall>}
      {!media.sm && <HomeContainerLarge>{props.children}</HomeContainerLarge>}
      {/* <HomeDrawerSmall>
        <Reparentable id="sm">{parent === 'sm' ? children : []}</Reparentable>
      </HomeDrawerSmall>

      <HomeContainerLarge>
        <Reparentable id="lg">{parent === 'lg' ? children : []}</Reparentable>
      </HomeContainerLarge> */}
    </AbsoluteVStack>
  )
}
