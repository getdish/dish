// debug
import { useStore, useStoreInstance } from '@dish/use-store'
import React from 'react'
import { Pressable, ScrollView } from 'react-native'
import {
  AbsoluteVStack,
  AnimatedVStack,
  BlurView,
  Spacer,
  Theme,
  VStack,
  prevent,
  useMedia,
  useTheme,
} from 'snackui'

import { drawerWidthMax, isWeb, searchBarHeight } from '../constants/constants'
import { isTouchDevice } from '../constants/platforms'
import { AutocompleteItem } from '../helpers/createAutocomplete'
import { AutocompleteItemView } from './AutocompleteItemView'
import { AutocompleteStore, AutocompleteTarget, autocompletesStore } from './AutocompletesStore'
import { CloseButton } from './views/CloseButton'

export const AutocompleteFrame = ({ children }: { children: any }) => {
  const autocompletes = useStoreInstance(autocompletesStore)
  const isShowing = autocompletes.visible
  const media = useMedia()
  const theme = useTheme()
  const topOffsetSm = searchBarHeight

  return (
    <AbsoluteVStack
      position="absolute"
      opacity={isShowing ? 1 : 0}
      pointerEvents={isShowing ? 'auto' : 'none'}
      fullscreen
      alignItems="flex-end"
      borderRadius={12}
      overflow="hidden"
      top={media.sm ? topOffsetSm : 0}
      left={0}
      right={0}
      bottom={0}
      // DONT PUT EVENT HERE NEED TO DEBUG WHY IT BREAKS ON NATIVE
    >
      <VStack
        onPress={() => autocompletes.setVisible(false)}
        flex={1}
        height="100%"
        maxWidth={drawerWidthMax}
      >
        <AbsoluteVStack backgroundColor={theme.backgroundColor} fullscreen opacity={0.9} />
        <AbsoluteVStack
          fullscreen
          backgroundColor="rgba(30,30,30,0.85)"
          display={media.sm ? 'flex' : 'none'}
        />
        <AbsoluteVStack fullscreen display={media.sm ? 'none' : 'flex'}>
          <BlurView
            fallbackBackgroundColor="transparent"
            blurRadius={200}
            blurType="dark"
            position="absolute"
            fullscreen
          />
        </AbsoluteVStack>
        <AbsoluteVStack zIndex={10000} top={10} right={10} pointerEvents="auto">
          <CloseButton size={20} onPressOut={prevent} zIndex={1000} onPress={hideAutocompletes} />
        </AbsoluteVStack>
        <VStack
          className="ease-in-out"
          position="relative"
          width="100%"
          height="100%"
          overflow="hidden"
          minHeight={200}
          padding={5}
          borderRadius={media.sm ? 0 : 10}
          flex={media.sm ? 1 : 0}
          // dont add events here :(
        >
          <Pressable
            style={{ flex: 1 }}
            onPress={() => {
              autocompletes.setVisible(false)
            }}
          >
            <ScrollView
              // styles for native
              style={{ maxHeight: '100%', flex: 1, height: '100%' }}
              keyboardShouldPersistTaps="always"
            >
              {/* bugfix AutocompleteItemView causes dragging to disable */}
              {isWeb ? children : isShowing ? children : null}

              {/* pad bottom to scroll */}
              <VStack height={100} />
            </ScrollView>
          </Pressable>
        </VStack>
      </VStack>
    </AbsoluteVStack>
  )
}
const hideAutocompletes = (e) => {
  e.stopPropagation()
  autocompletesStore.setVisible(false)
}

export type AutocompleteSelectCb = (result: AutocompleteItem, index: number) => void

export const AutocompleteResults = ({
  target,
  prefixResults = [],
  onSelect,
}: {
  target: AutocompleteTarget
  prefixResults?: any[]
  onSelect: AutocompleteSelectCb
  emptyResults?: AutocompleteItem[]
}) => {
  const autocompleteStore = useStore(AutocompleteStore, { target })
  const activeIndex = autocompleteStore.index
  const ogResults = autocompleteStore.results
  const results = [...prefixResults, ...ogResults]
  return (
    <VStack paddingVertical={10}>
      {results.map((result, index) => {
        const isActive = !isTouchDevice && activeIndex === index
        return (
          <React.Fragment key={`${result.id}${index}`}>
            <Theme name={isActive ? 'active' : 'dark'}>
              <AutocompleteItemView
                target={target}
                index={index}
                result={result}
                onSelect={onSelect}
                isActive={isActive}
              />
            </Theme>
            <Spacer size={1} />
          </React.Fragment>
        )
      })}
    </VStack>
  )
}
