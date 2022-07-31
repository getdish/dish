import { isHermes } from './constants/platforms'
import { Paragraph, isWeb } from '@dish/ui'
import React from 'react'
import { SafeAreaView } from 'react-native'

export const DebugHUD = () => {
  if (isWeb) return null

  return (
    <SafeAreaView>
      <Paragraph
        position="absolute"
        backgroundColor="#fff"
        color="#000"
        opacity={0.2}
        size="$1"
      >
        {isHermes ? 'hermes' : 'jsc'}
      </Paragraph>
    </SafeAreaView>
  )
}
