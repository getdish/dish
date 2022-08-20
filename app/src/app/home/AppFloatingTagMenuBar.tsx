import { autocompletesStore } from '../AutocompletesStore'
import { HomeTopSearches } from './HomeTopSearches'
import { XStack, useMedia } from '@dish/ui'
import { useStoreInstanceSelector } from '@dish/use-store'
import React, { memo } from 'react'
import { ScrollView } from 'react-native'

export const AppFloatingTagMenuBar = memo(() => {
  const media = useMedia()
  const isShowingLocationAutocomplete = useStoreInstanceSelector(
    autocompletesStore,
    (x) => x.visible && x.target === 'location'
  )
  const shouldHide = media.gtSm && isShowingLocationAutocomplete

  return (
    <XStack
      className="ease-in-out-slow"
      position="relative"
      pointerEvents={shouldHide ? 'none' : 'auto'}
      zIndex={-1}
      // y={shouldHide ? -80 : 0}
      top={0}
      maxWidth="100%"
    >
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
          <HomeTopSearches />
        </XStack>
      </ScrollView>
    </XStack>
  )
})
