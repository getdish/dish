import { AbsoluteYStack, LinearGradient, XStack, useMedia, useThemeName } from '@dish/ui'
import { useStoreInstanceSelector } from '@dish/use-store'
import React, { memo } from 'react'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { autocompletesStore } from '../AutocompletesStore'
import { HomeRegionTitle } from './HomeRegionTitle'
import { HomeTopSearches } from './HomeTopSearches'

export const AppFloatingTagMenuBar = memo(() => {
  const media = useMedia()
  const themeName = useThemeName()
  const isShowingLocationAutocomplete = useStoreInstanceSelector(
    autocompletesStore,
    (x) => x.visible && x.target === 'location'
  )
  const shouldHide = media.notSm && isShowingLocationAutocomplete

  return (
    <XStack
      className="ease-in-out-slow"
      position="relative"
      pointerEvents={shouldHide ? 'none' : 'auto'}
      zIndex={-1}
      y={shouldHide ? -80 : 0}
      maxWidth="100%"
    >
      <AbsoluteYStack left={0} right={0} bottom={-20} top={-10} zIndex={-1}>
        <LinearGradient
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
          colors={
            media.sm
              ? [`#22222200`, themeName === 'dark' ? '#222222' : `#22222233`]
              : [`#22222233`, `#22222200`]
          }
        />
      </AbsoluteYStack>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        bounces
        horizontal
        style={{ width: '100%' }}
      >
        <XStack
          alignItems="center"
          paddingVertical={20}
          paddingHorizontal={15}
          {...(media.sm && {
            paddingVertical: 10,
            paddingHorizontal: 10,
          })}
        >
          <HomeRegionTitle />
          <HomeTopSearches />
        </XStack>
      </ScrollView>
    </XStack>
  )
})
