import React, { useRef } from 'react'
import { HStack, Hoverable } from 'snackui'

import { useIsNarrow } from './hooks/useIs'
import { useOvermind } from './state/useOvermind'

export const AppAutocompleteHoverableInput = ({
  children,
  input,
  autocompleteTarget,
  backgroundColor,
  borderRadius = 10,
}: {
  children: any
  input?: HTMLInputElement | null
  autocompleteTarget: 'search' | 'location'
  backgroundColor?: string
  borderRadius?: number
}) => {
  const om = useOvermind()
  const tm = useRef<any>(null)
  const tm2 = useRef<any>(null)
  const isSmall = useIsNarrow()

  return (
    <Hoverable
      onHoverOut={() => {
        clearTimeout(tm.current)
        clearTimeout(tm2.current)
      }}
      onHoverMove={() => {
        clearTimeout(tm.current)
        if (om.state.home.currentState.searchQuery) {
          tm.current = setTimeout(() => {
            if (document.activeElement == input) {
              om.actions.home.setShowAutocomplete(autocompleteTarget)
            }
          }, 150)
        }
      }}
    >
      <HStack
        backgroundColor={
          isSmall ? 'rgba(0,0,0,0.05)' : backgroundColor ?? 'transparent'
        }
        borderRadius={borderRadius}
        width="100%"
      >
        {children}
      </HStack>
    </Hoverable>
  )
}
