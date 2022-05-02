import { drawerWidthMax, searchBarHeight, zIndexAutocomplete } from '../constants/constants'
import { AutocompleteTarget, autocompletesStore } from './AutocompletesStore'
import { CloseButton } from './views/CloseButton'
import { ContentParentStore, ContentScrollView } from './views/ContentScrollView'
import { isSafari } from '@dish/helpers'
import {
  AbsoluteYStack,
  BlurView,
  YStack,
  isTouchDevice,
  prevent,
  useDebounceValue,
  useMedia,
  useTheme,
} from '@dish/ui'
import { useStore, useStoreInstance } from '@dish/use-store'
import React, { memo, useEffect } from 'react'

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
      <AbsoluteYStack
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
        <YStack
          maxWidth={drawerWidthMax}
          width="100%"
          height="100%"
          maxHeight="100%"
          overflow="hidden"
          // DONT PUT EVENT HERE NEED TO DEBUG WHY IT BREAKS ON NATIVE
        >
          <AbsoluteYStack backgroundColor="$background" fullscreen opacity={isSafari ? 1 : 0.9} />
          <AbsoluteYStack fullscreen display={media.sm ? 'none' : 'flex'}>
            {!isSafari && (
              <BlurView
                fallbackBackgroundColor="transparent"
                blurRadius={200}
                blurType="dark"
                position="absolute"
                // fullscreen
              />
            )}
          </AbsoluteYStack>
          <AbsoluteYStack
            zIndex={10000}
            top={media.sm ? 10 : searchBarHeight + 18}
            right={10}
            pointerEvents="auto"
          >
            <CloseButton
              elevation="$1"
              onPressOut={prevent}
              zIndex={1000}
              onPress={hideAutocompletes}
            />
          </AbsoluteYStack>
          <YStack
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
              <YStack height={100} />
            </ContentScrollView>
          </YStack>
        </YStack>
      </AbsoluteYStack>
    )
  }
)

const hideAutocompletes = (e) => {
  e.stopPropagation()
  autocompletesStore.setVisible(false)
}
