import { isSafari } from '@dish/helpers'
import { useStore, useStoreInstance } from '@dish/use-store'
import React, { memo, useEffect } from 'react'
import {
  AbsoluteVStack,
  BlurView,
  Spacer,
  Theme,
  VStack,
  isTouchDevice,
  prevent,
  useDebounceValue,
  useMedia,
  useTheme,
} from 'snackui'

import { drawerWidthMax, isWeb, searchBarHeight, zIndexAutocomplete } from '../constants/constants'
import { AutocompleteItem } from '../helpers/createAutocomplete'
import { AutocompleteItemView } from './AutocompleteItemView'
import { AutocompleteStore, AutocompleteTarget, autocompletesStore } from './AutocompletesStore'
import { usePageFinishedLoading } from './usePageFinishedLoading'
import { CloseButton } from './views/CloseButton'
import { ContentParentStore, ContentScrollView } from './views/ContentScrollView'

export const AutocompleteFrame = memo(
  ({ children, target }: { children: any; target: AutocompleteTarget }) => {
    const autocompletes = useStoreInstance(autocompletesStore)
    const isShowing = autocompletes.visible && autocompletes.target === target
    const media = useMedia()
    const theme = useTheme()

    // safari ios drag optimization, when fully inactive hide it
    const isOut = isSafari && isTouchDevice && !isShowing
    const isOutDelayed = useDebounceValue(isOut, 300)
    const isFullyOut = isOutDelayed

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
        fullscreen
        opacity={isShowing ? 1 : 0}
        pointerEvents={isShowing ? 'auto' : 'none'}
        zIndex={isShowing ? zIndexAutocomplete : -100}
        display={isFullyOut ? 'none' : 'flex'}
        borderRadius={14}
        overflow="hidden"
        flex={1}
        {...(media.sm && {
          transform: [{ translateY: 10 }],
        })}
        {...(media.notSm && {
          paddingTop: searchBarHeight + 10,
          marginLeft: 'auto',
          width: '100%',
          maxWidth: drawerWidthMax,
        })}

        // DONT PUT EVENT HERE NEED TO DEBUG WHY IT BREAKS ON NATIVE
      >
        <VStack
          maxWidth={drawerWidthMax}
          width="100%"
          height="100%"
          maxHeight="100%"
          overflow="hidden"
          // DONT PUT EVENT HERE NEED TO DEBUG WHY IT BREAKS ON NATIVE
        >
          <AbsoluteVStack
            backgroundColor={theme.backgroundColor}
            fullscreen
            opacity={isSafari ? 1 : 0.9}
          />
          <AbsoluteVStack fullscreen display={media.sm ? 'none' : 'flex'}>
            {!isSafari && (
              <BlurView
                fallbackBackgroundColor="transparent"
                blurRadius={200}
                blurType="dark"
                position="absolute"
                fullscreen
              />
            )}
          </AbsoluteVStack>
          <AbsoluteVStack
            zIndex={10000}
            top={media.sm ? 10 : searchBarHeight + 25}
            right={10}
            pointerEvents="auto"
          >
            <CloseButton size={20} onPressOut={prevent} zIndex={1000} onPress={hideAutocompletes} />
          </AbsoluteVStack>
          <VStack
            className="ease-in-out"
            position="relative"
            // width 100% messes up width on web to be too wide, using alignSelf instead
            alignSelf="stretch"
            height="100%"
            minHeight={200}
            padding={5}
            borderRadius={media.sm ? 0 : 10}
            flex={media.sm ? 1 : 0}
            overflow="hidden"
            // dont add events here :(
          >
            <ContentScrollView
              id="autocomplete"
              // styles for native
              style={{ maxHeight: '100%', flex: 1, height: '100%' }}
              keyboardShouldPersistTaps="always"
            >
              {/* bugfix AutocompleteItemView causes dragging to disable */}
              {/* second bugfix dont change children slows down rendering a ton... see if dragging bug happens again */}
              {children}

              {/* pad bottom to scroll */}
              <VStack height={100} />
            </ContentScrollView>
          </VStack>
        </VStack>
      </AbsoluteVStack>
    )
  }
)

const hideAutocompletes = (e) => {
  e.stopPropagation()
  autocompletesStore.setVisible(false)
}

export type AutocompleteSelectCb = (result: AutocompleteItem, index: number) => void

export const AutocompleteResults = memo(
  ({
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
    const loaded = usePageFinishedLoading()
    const media = useMedia()

    if (!loaded) {
      return null
    }

    return (
      <>
        {results.map((result, index) => {
          const isActive = !isWeb ? index === 0 : activeIndex === index
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

        {/* on small screens add */}
        <VStack height={media.pointerCoarse ? 300 : 0} />
      </>
    )
  }
)
