import React, { useRef } from 'react'
import { Hoverable } from 'snackui'

import { autocompletesStore } from './AutocompletesStore'
import { useHomeStore } from './homeStore'

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
  const home = useHomeStore()
  const tm = useRef<any>(null)
  const tm2 = useRef<any>(null)
  return (
    <Hoverable
      onHoverOut={() => {
        clearTimeout(tm.current)
        clearTimeout(tm2.current)
      }}
      onHoverMove={() => {
        clearTimeout(tm.current)
        tm.current = setTimeout(() => {
          if (home.currentState.searchQuery) {
            if (document.activeElement == input) {
              autocompletesStore.setTarget(autocompleteTarget)
            }
          }
        }, 150)
      }}
    >
      {children}
    </Hoverable>
  )
}
