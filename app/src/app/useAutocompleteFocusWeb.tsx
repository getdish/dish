import { autocompletesStore } from './AutocompletesStore'
import { InputStore } from './inputStore'
import { UNWRAP_PROXY, reaction } from '@tamagui/use-store'
import { useEffect } from 'react'

export const useAutocompleteFocusWebNonTouch = (inputStore: InputStore) => {
  useEffect(() => {
    return reaction(
      inputStore,
      (x) => x.node,
      (node) => {
        if (!node) {
          return false
        }
        let mouseDownAt = Date.now()
        let moveInit = [0, 0]
        let moveAt = [0, 0]

        const mouseMove = (e: MouseEvent) => {
          moveAt = [e.pageX, e.pageY]
        }

        const onMouseUp = () => {
          window.removeEventListener('mousemove', mouseMove)
          const isFocused = inputStore[UNWRAP_PROXY].isFocused
          if (!isFocused) {
            return
          }
          const didMoveALot =
            Math.abs(moveInit[0] - moveAt[0]) + Math.abs(moveInit[1] - moveAt[1]) > 15
          const didLeaveMouseDown = Date.now() - mouseDownAt > 500
          // dont slide up to be nice to text selection!
          const shouldSlideOpen = didMoveALot || didLeaveMouseDown
          autocompletesStore.setTarget(inputStore.props.name, !shouldSlideOpen)
        }

        const mouseDown = (e: MouseEvent) => {
          mouseDownAt = Date.now()
          moveInit = [e.pageX, e.pageY]
          moveAt = moveInit
          window.addEventListener('mousemove', mouseMove)
        }

        node.addEventListener('pointerup', onMouseUp)
        node.addEventListener('mouseup', onMouseUp)
        node.addEventListener('mousedown', mouseDown)
        return () => {
          node.removeEventListener('pointerup', onMouseUp)
          node.removeEventListener('mouseup', onMouseUp)
          node.removeEventListener('mousedown', mouseDown)
          window.removeEventListener('mousemove', mouseMove)
        }
      }
    )
  }, [])
}
