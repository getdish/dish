import { Ref, RefObject, useLayoutEffect } from 'react'

import { getNode } from '../helpers/getNode'

// works with react-native-web
// should be simpler but we need lower level access
export function useAttachClassName(
  cn: string | undefined,
  ref: RefObject<any>,
  mountArgs: any[] = []
) {
  useLayoutEffect(() => {
    if (!cn) return
    if (!ref.current) return
    const node = getNode(ref.current)
    if (!node) {
      return
    }
    const names = cn.trim().split(' ').filter(Boolean)

    function addClassNames() {
      const cl = new Set(node.classList)
      for (const name of names) {
        if (!cl.has(name)) {
          node.classList?.add(name)
        }
      }
    }

    addClassNames()

    if (!(node instanceof HTMLElement)) {
      // disable mutation observation in other envs
      return
    }

    const observer = new MutationObserver(() => {
      addClassNames()
    })
    observer.observe(node, {
      attributes: true,
    })

    return () => {
      observer.disconnect()
      names.forEach((x) => node.classList.remove(x))
    }
  }, [...mountArgs, cn])
}
