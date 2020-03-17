import { RefObject, useEffect, useRef, useState } from 'react'

import { useNodeSize, UseNodeSizeProps } from './useNodeSize'

export function useParentNodeSize(props?: UseNodeSizeProps) {
  const ref = useRef<HTMLElement>(null)
  const [parentNode, setParentNode] = useState<RefObject<HTMLElement>>(null)

  const sizer = useNodeSize({
    ref: parentNode,
    ...props,
  })

  useEffect(() => {
    if (!ref.current) return
    let parent = ref.current.parentElement
    // avoid display contents nodes
    if (parent) {
      // @ts-ignore
      while (parent.computedStyleMap().get('display') === 'contents') {
        parent = parent.parentElement
        if (!parent) break
      }
    }
    setParentNode({ current: parent })
  }, [ref.current])

  return {
    ...sizer,
    ref,
  }
}
