import { useEffect } from 'react'

import { useOvermind } from '../../state/om'
import { useIsMountedRef } from './useIsMountedRef'

export const usePageLoadEffect = (
  isReady: boolean,
  cb: (isMounted: { current: boolean }) => void
) => {
  const om = useOvermind()
  const isMounted = useIsMountedRef()

  useEffect(() => {
    let dispose = null
    if (isReady) {
      dispose = cb(isMounted)
    }
    return () => {
      dispose?.()
    }
  }, [isReady, om.state.home.refreshCurrentPage])
}
