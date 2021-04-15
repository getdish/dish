import { useEffect } from 'react'

import { AutocompleteTarget, autocompletesStore } from './AppAutocomplete'
import { getIsFocused } from './AppSearchInput'

export const useAutocompleteFocusWebNonTouch = ({
  target,
  input,
}: {
  target: AutocompleteTarget
  input: HTMLInputElement | null
}) => {
  useEffect(() => {
    if (!input) return
    let mouseDownAt = Date.now()
    let wasFocused = false
    let moveInit = [0, 0]
    let moveAt = [0, 0]

    const mouseMove = (e: MouseEvent) => {
      moveAt = [e.pageX, e.pageY]
    }

    const onMouseUp = () => {
      window.removeEventListener('mousemove', mouseMove)
      const isFocused = getIsFocused()
      const shouldFocus = !wasFocused && isFocused
      console.log('should focus', { shouldFocus, wasFocused, isFocused })
      if (!shouldFocus) {
        return
      }
      const didMoveALot = Math.abs(moveInit[0] - moveAt[0]) + Math.abs(moveInit[1] - moveAt[1]) > 15
      const didLeaveMouseDown = Date.now() - mouseDownAt > 500
      // dont slide up to be nice to text selection!
      const shouldSlideOpen = didMoveALot || didLeaveMouseDown
      autocompletesStore.setTarget(target, !shouldSlideOpen)
    }

    const mouseDown = (e: MouseEvent) => {
      wasFocused = getIsFocused()
      mouseDownAt = Date.now()
      moveInit = [e.pageX, e.pageY]
      moveAt = moveInit
      window.addEventListener('mousemove', mouseMove)
    }

    input.addEventListener('pointerup', onMouseUp)
    input.addEventListener('mouseup', onMouseUp)
    input.addEventListener('mousedown', mouseDown)
    return () => {
      input.removeEventListener('pointerup', onMouseUp)
      input.removeEventListener('mouseup', onMouseUp)
      input.removeEventListener('mousedown', mouseDown)
      window.removeEventListener('mousemove', mouseMove)
    }
  }, [input])
}
