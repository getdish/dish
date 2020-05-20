import { graphql } from '@dish/graph'
import { ZStack } from '@dish/ui'
import React, { memo } from 'react'
import { Text } from 'react-native'

import { useOvermind } from '../../state/useOvermind'
import { CloseButton } from './CloseButton'

export default memo(function HomePageGallery() {
  const om = useOvermind()
  const homeStateType = om.state.home.currentStateType

  if (homeStateType === 'gallery') {
    return <HomePageGalleryContent />
  }

  return null
})

const HomePageGalleryContent = graphql(function HomePageGalleryContent() {
  const om = useOvermind()

  return (
    <ZStack
      fullscreen
      backgroundColor="rgba(0,0,0,0.5)"
      alignItems="center"
      justifyContent="center"
      zIndex={10000000000}
    >
      <CloseButton
        onPress={() => {
          om.actions.home.popTo(-1)
        }}
      />
      <Text>hello world from gallery</Text>
    </ZStack>
  )
})
