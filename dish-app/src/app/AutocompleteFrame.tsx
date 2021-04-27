import { useStore, useStoreInstance } from '@dish/use-store'
import React, { useEffect } from 'react'
import {
  AbsoluteVStack,
  BlurView,
  Spacer,
  Theme,
  VStack,
  prevent,
  useMedia,
  useTheme,
} from 'snackui'

import { drawerWidthMax, isWeb } from '../constants/constants'
import { isTouchDevice } from '../constants/platforms'
import { AutocompleteItem } from '../helpers/createAutocomplete'
import { AutocompleteItemView } from './AutocompleteItemView'
import { AutocompleteStore, AutocompleteTarget, autocompletesStore } from './AutocompletesStore'
import { CloseButton } from './views/CloseButton'
import { ContentParentStore, ContentScrollView } from './views/ContentScrollView'

export const AutocompleteFrame = ({
  children,
  target,
}: {
  children: any
  target: AutocompleteTarget
}) => {
  const autocompletes = useStoreInstance(autocompletesStore)
  const isShowing = autocompletes.visible && autocompletes.target === target
  const media = useMedia()
  const theme = useTheme()

  const contentParentStore = useStore(ContentParentStore)
  useEffect(() => {
    if (isShowing) {
      let prev = contentParentStore.activeId
      contentParentStore.setActiveId('autocomplete')
      return () => {
        contentParentStore.setActiveId(prev)
      }
    }
  }, [isShowing])

  return (
    <AbsoluteVStack
      opacity={isShowing ? 1 : 0}
      pointerEvents={isShowing ? 'auto' : 'none'}
      borderRadius={14}
      overflow="hidden"
      top={0}
      bottom={0}
      left={0}
      right={0}
      {...(media.sm && {
        top: 10,
      })}

      // DONT PUT EVENT HERE NEED TO DEBUG WHY IT BREAKS ON NATIVE
    >
      <VStack
        maxWidth={drawerWidthMax}
        width="100%"
        height="100%"
        maxHeight="100%"
        // DONT PUT EVENT HERE NEED TO DEBUG WHY IT BREAKS ON NATIVE
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
          // width 100% messes up width on web to be too wide, using alignSelf instead
          alignSelf="stretch"
          height="100%"
          overflow="hidden"
          minHeight={200}
          padding={5}
          borderRadius={media.sm ? 0 : 10}
          flex={media.sm ? 1 : 0}
          // dont add events here :(
        >
          {/* <Pressable
            style={{ flex: 1 }}
            onPress={() => {
              autocompletes.setVisible(false)
            }}
          > */}
          <ContentScrollView
            id="autocomplete"
            // styles for native
            style={{ maxHeight: '100%', flex: 1, height: '100%' }}
            keyboardShouldPersistTaps="always"
          >
            {/* bugfix AutocompleteItemView causes dragging to disable */}
            {isWeb ? children : isShowing ? children : null}

            {/* pad bottom to scroll */}
            <VStack height={100} />
          </ContentScrollView>
          {/* </Pressable> */}
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
    <>
      {results.map((result, index) => {
        const isActive = isTouchDevice ? index === 0 : activeIndex === index
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
    </>
  )
}
