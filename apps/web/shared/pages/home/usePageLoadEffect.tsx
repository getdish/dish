import { useEffect } from 'react'

import { useOvermind } from '../../state/om'
import { useIsMountedRef } from './useIsMountedRef'

export const usePageLoadEffect = (
  isReady: boolean,
  cb: (opts: { isRefreshing: boolean }) => (() => any) | void,
  mountArgs: any[] = []
) => {
  const om = useOvermind()

  useEffect(() => {
    if (isReady) {
      const dispose = cb({ isRefreshing: false })

      const dispose2 = om.reaction(
        () => om.state.home.refreshCurrentPage,
        () => {
          console.warn('refresh')
          cb({ isRefreshing: true })
        }
      )

      return () => {
        if (dispose) dispose()
        dispose2()
      }
    }
  }, [isReady, ...mountArgs])
}
