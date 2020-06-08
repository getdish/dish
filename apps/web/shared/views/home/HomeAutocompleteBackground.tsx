import { LinearGradient } from '@dish/ui'
import { ZStack } from '@dish/ui'
import React, { memo } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

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
    >
      <TouchableOpacity
        style={[StyleSheet.absoluteFill]}
        onPress={() => {
          om.actions.home.setShowAutocomplete(false)
        }}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
          style={[StyleSheet.absoluteFill, { height: 160 }]}
        />
      </TouchableOpacity>
    </ZStack>
  )
})
