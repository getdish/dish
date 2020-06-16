import { LinearGradient, ZStack } from '@dish/ui'
import React, { memo } from 'react'
import { StyleSheet } from 'react-native'

import { useOvermind } from '../../state/useOvermind'
import { useShowAutocomplete } from './HomeAutocomplete'
import { homePageBorderRadius } from './HomePage'

export const HomeAutocompleteBackground = memo(() => {
  const om = useOvermind()
  const show = useShowAutocomplete()
  return (
    <ZStack
      className="ease-in-out-fast"
      opacity={show ? 1 : 0}
      disabled={!show}
      fullscreen
      top={-homePageBorderRadius}
      left={-homePageBorderRadius}
      right={-homePageBorderRadius}
      zIndex={11}
      onPressOut={() => {
        om.actions.home.setShowAutocomplete(false)
      }}
      pressStyle={{
        opacity: 0.6,
      }}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.06)', 'rgba(255,255,255,0)']}
        style={[StyleSheet.absoluteFill, { height: 160 }]}
      />
    </ZStack>
  )
})
