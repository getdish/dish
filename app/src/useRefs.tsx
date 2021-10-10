import { useRef } from 'react'
import { PinchGestureHandler } from 'react-native-gesture-handler'

export const useRefs = () => {
  const pan = useRef()
  const tap = useRef()
  const doubleTap = useRef()
  const pinch = useRef<PinchGestureHandler>()
  return {
    pan,
    tap,
    doubleTap,
    pinch,
  }
}
