import { drawerWidthMax, searchBarHeight, zIndexAutocomplete } from '../constants/constants'
import { AutocompleteTarget, autocompletesStore } from './AutocompletesStore'
import { CloseButton } from './views/CloseButton'
import { ContentParentStore, ContentScrollView } from './views/ContentScrollView'
import { StackDrawer } from './views/StackDrawer'
import { isSafari } from '@dish/helpers'
import { AbsoluteYStack, YStack, useDebounceValue, useIsTouchDevice, useMedia } from '@dish/ui'
import { useStore, useStoreInstance } from '@dish/use-store'
import React, { memo, useEffect } from 'react'

export const AutocompleteFrame = memo(
  ({ children, target }: { children: any; target: AutocompleteTarget }) => {
    const autocompletes = useStoreInstance(autocompletesStore)
    const isShowing = autocompletes.visible && autocompletes.target === target
    const media = useMedia()

    // safari ios drag optimization, when fully inactive hide it
    const isTouchDevice = useIsTouchDevice()
    const isOut = isSafari && isTouchDevice && !isShowing
    const isOutDelayed = useDebounceValue(isOut, 300)
    const isFullyOut = isOutDelayed

    const contentParentStore = useStore(ContentParentStore)
    useEffect(() => {
      if (isShowing) {
        const prev = contentParentStore.activeId
        contentParentStore.setActiveId('autocomplete')
        return () => {
          contentParentStore.setActiveId(prev)
        }
      }
    }, [isShowing])

    return (
      <YStack
        fullscreen
        minHeight={100000}
        opacity={isShowing ? 1 : 0}
        pointerEvents={isShowing ? 'auto' : 'none'}
        zIndex={isShowing ? 1 : -1}
        display={isFullyOut ? 'none' : 'flex'}
      >
        <StackDrawer
          closable
          onClose={() => {
            autocompletes.setVisible(false)
          }}
        >
          <YStack
            className="ease-in-out"
            position="relative"
            alignSelf="stretch"
            height="100%"
            minHeight={200}
            padding={5}
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
        </StackDrawer>
      </YStack>
    )
  }
)

const hideAutocompletes = (e) => {
  e.stopPropagation()
  autocompletesStore.setVisible(false)
}
