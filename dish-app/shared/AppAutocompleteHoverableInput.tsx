import { HStack, Hoverable } from '@dish/ui'
import React, { useRef } from 'react'

import { useIsNarrow } from './hooks/useIs'
import { useOvermind } from './state/om'

export const AppAutocompleteHoverableInput = ({
  children,
  input,
  autocompleteTarget,
}: {
  children: any
  input?: HTMLInputElement | null
  autocompleteTarget: 'search' | 'location'
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
        backgroundColor={isSmall ? '#f2f2f2' : 'transparent'}
        borderRadius={10}
        width="100%"
      >
        {children}
      </HStack>
    </Hoverable>
  )
}
