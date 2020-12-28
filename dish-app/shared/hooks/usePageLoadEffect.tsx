import { useLayoutEffect } from 'react'

import { pagesStore } from '../pages/PagesStore'
import { HomeStateItem } from '../state/home-types'

export type PageLoadEffectCallback = (opts: {
  isRefreshing: boolean
  item: HomeStateItem
}) => (() => any) | void

export const usePageLoadEffect = (
  props: { isActive: boolean; item: HomeStateItem },
  cb: PageLoadEffectCallback,
  mountArgs: any[] = []
) => {
  useLayoutEffect(() => {
    if (props.isActive) {
      let dispose = cb({ isRefreshing: false, item: props.item })

      let last = 0
      const dispose2 = pagesStore.subscribe(() => {
        if (last !== pagesStore.refreshVersion) {
          last = pagesStore.refreshVersion
          if (dispose) dispose()
          dispose = cb({ isRefreshing: true, item: props.item })
        }
      })

      return () => {
        if (dispose) dispose()
        dispose2()
      }
    }
    return undefined
  }, [props.isActive, ...mountArgs])
}
