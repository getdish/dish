import { useEffect, useRef } from 'react'

import { useOvermind } from '../../state/om'

export const usePageLoadEffect = (
  isReady: boolean,
  cb: (isMounted: { current: boolean }) => void
) => {
  const om = useOvermind()
  const isMounted = useRef(true)

  useEffect(() => {
    let dispose = null
    if (isReady) {
      dispose = cb(isMounted)
    }
    return () => {
      isMounted.current = false
      dispose?.()
    }
  }, [isReady, om.state.home.refresh])
}
