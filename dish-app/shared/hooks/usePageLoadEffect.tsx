import { useLayoutEffect } from 'react'

import { HomeStateItem } from '../state/home-types'
import { useOvermind } from '../state/useOvermind'

export type PageLoadEffectCallback = (opts: {
  isRefreshing: boolean
  item: HomeStateItem
}) => (() => any) | void

export const usePageLoadEffect = (
  props: { isActive: boolean; item: HomeStateItem },
  cb: PageLoadEffectCallback,
  mountArgs: any[] = []
) => {
  const om = useOvermind()

  useLayoutEffect(() => {
    if (props.isActive) {
      const dispose = cb({ isRefreshing: false, item: props.item })

      const dispose2 = om.reaction(
        () => om.state.home.refreshCurrentPage,
        () => {
          console.warn('refresh')
          cb({ isRefreshing: true, item: props.item })
        }
      )

      return () => {
        if (dispose) dispose()
        dispose2()
      }
    }
  }, [props.isActive, ...mountArgs])
}
