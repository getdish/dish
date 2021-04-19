import { useStore, useStoreInstance } from '@dish/use-store'
import React from 'react'
import { ScrollView } from 'react-native'
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

  const content = (
    <AbsoluteVStack
      zIndex={100000000}
      opacity={isShowing ? 1 : 0}
      pointerEvents={isShowing ? 'auto' : 'none'}
      fullscreen
      alignItems="flex-end"
      marginTop={5}
      borderRadius={12}
      overflow="hidden"
      top={media.sm ? topOffsetSm : 0}
      onPress={() => autocompletes.setVisible(false)}
    >
      <VStack width="100%" height="100%" maxWidth={drawerWidthMax}>
        <AbsoluteVStack backgroundColor={theme.backgroundColor} fullscreen />
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
        <AbsoluteVStack top={10} right={10}>
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
          onPress={() => {
            autocompletes.setVisible(false)
          }}
        >
          <ScrollView style={{ maxHeight: '100%' }} keyboardShouldPersistTaps="always">
            {children}

            {/* pad bottom to scroll */}
            <VStack height={100} />
          </ScrollView>
        </VStack>
      </VStack>
    </AbsoluteVStack>
  )

  if (!isWeb) {
    return (
      <AnimatedVStack
        position="absolute"
        pointerEvents="none"
        fullscreen
        height="100%"
        zIndex={100000000}
        flex={1}
      >
        {content}
      </AnimatedVStack>
    )
  }

  return content
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
        const isActive = activeIndex === index
        return (
          <React.Fragment key={`${result.id}${index}`}>
            <Theme name={isActive ? 'active' : null}>
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
