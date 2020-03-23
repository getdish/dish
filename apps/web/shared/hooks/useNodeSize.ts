import { isEqual } from '@o/fast-compare'
import {
  RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useVisibility } from '../Visibility'
import { useResizeObserver } from './useResizeObserver'
import { useThrottledFn } from './useThrottleFn'

export type UseNodeSizeProps = {
  ref?: RefObject<HTMLElement>
  disable?: boolean
  onChange?: (size: { width: number; height: number }) => any
  throttle?: number
  ignoreFirst?: boolean
}

type SizeState = {
  width: number
  height: number
}

export function useNodeSize(
  props: UseNodeSizeProps = {},
  mountArgs: any[] = []
) {
  const isVisible = useRef(true)
  const [state, setState] = useState<SizeState>({ width: 0, height: 0 })
  const cur = useRef(null)
  const updateFn = (val: SizeState) => {
    // avoid updates when not visible, it can return width: 0, height: 0
    if (!isVisible.current) return
    if (!isEqual(val, cur.current)) {
      const cb = props.onChange || setState
      cur.current = val
      cb(val)
    }
  }
  const updateFnThrottled = useThrottledFn(updateFn, {
    amount: props.throttle || 0,
    ignoreFirst: props.ignoreFirst,
  })
  const update = props.throttle > -1 ? updateFnThrottled : updateFn
  const innerRef = useRef<HTMLElement>(null)
  const propRef = props.ref
  const ref = propRef || innerRef
  const disable = props.disable

  const updateSize = () => {
    if (disable) return
    requestAnimationFrame(() => {
      if (ref.current) {
        update({
          width: ref.current.clientWidth,
          height: ref.current.clientHeight,
        })
      }
    })
  }

  useVisibility({
    onChange(next) {
      isVisible.current = next
      next && updateSize()
    },
  })

  useResizeObserver(
    {
      ref,
      disable,
      onChange: (entries) => {
        const { width, height } = entries[0].contentRect
        const next = { width, height }
        update(next)
      },
    },
    [mountArgs]
  )

  // useLayout?
  useEffect(updateSize, [disable, ref, ...mountArgs])

  return useMemo(
    () => ({
      ...state,
      ref,
    }),
    [state.width, state.height, ref]
  )
}
