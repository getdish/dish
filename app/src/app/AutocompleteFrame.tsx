import { AutocompleteTarget, autocompletesStore } from './AutocompletesStore'
import { StackDrawer } from './views/StackDrawer'
import { isSafari } from '@dish/helpers'
import { YStack, useDebounceValue, useIsTouchDevice } from '@dish/ui'
import { useGlobalStore } from '@tamagui/use-store'
import React, { memo } from 'react'

export const AutocompleteFrame = memo(
  ({ children, target }: { children: any; target: AutocompleteTarget }) => {
    const autocompletes = useGlobalStore(autocompletesStore)
    const isShowing = autocompletes.visible && autocompletes.target === target
    // const media = useMedia()

    // safari ios drag optimization, when fully inactive hide it
    const isTouchDevice = useIsTouchDevice()
    const isOut = isSafari && isTouchDevice && !isShowing
    const isOutDelayed = useDebounceValue(isOut, 300)
    const isFullyOut = isOutDelayed

    return (
      <YStack
        fullscreen
        minHeight={100000}
        opacity={isShowing ? 1 : 0}
        pointerEvents={isShowing ? 'auto' : 'none'}
        zIndex={isShowing ? 1000000000 : -1}
        display={isFullyOut ? 'none' : 'flex'}
      >
        <StackDrawer
          closable
          disabled={!isShowing}
          onClose={() => {
            autocompletes.setVisible(false)
          }}
        >
          {/* bugfix AutocompleteItemView causes dragging to disable */}
          {/* second bugfix dont change children slows down rendering a ton... see if dragging bug happens again */}
          {children}

          {/* pad bottom to scroll */}
          <YStack height={100} />
        </StackDrawer>
      </YStack>
    )
  }
)
