import { useLayoutEffect, useRef, useState } from 'react'
import { LayoutRectangle } from 'react-native'

import { isWeb } from '../platform'

export const useLayout = (props: { onLayout?: (rect: LayoutRectangle) => void } = {}) => {
  const [layout, setLayout] = useState<LayoutRectangle | null>(null)
  if (!isWeb) {
    return {
      layout,
      onLayout: setLayout,
    }
  }

  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (!ref.current) {
      return
    }

    const update = (rect) => {
      setLayout((prev) => {
        let next
        if (!prev) {
          next = rect
        } else {
          const { x, y, width, height } = rect
          // don't set new layout state unless the layout has actually changed
          if (x !== prev.x || y !== prev.y || width !== prev.width || height !== prev.height) {
            next = { x, y, width, height }
          }
        }
        if (next) {
          props.onLayout?.(next)
          return next
        }
        return prev
      })
    }

    const ro = new ResizeObserver(([{ contentRect }] = []) => {
      update(contentRect)
    })
    ro.observe(ref.current)

    const io = new IntersectionObserver(([{ boundingClientRect }]) => {
      update(boundingClientRect)
    })
    io.observe(ref.current)

    //
    // const next = {
    //   width: ref.current.clientWidth,
    //   height: ref.current.clientHeight,
    // }
    // setLayout(next as any)
    // props.onLayout?.(next as any)
    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [ref.current])

  return {
    layout,
    ref,
  }
}