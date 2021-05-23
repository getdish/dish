import { useLayoutEffect } from 'react'

import { HomeStateItem } from '../../types/homeTypes'
import { pagesStore } from '../pagesStore'

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
    if (!props.isActive) return
    let dispose = cb({ isRefreshing: false, item: props.item })

    let last = pagesStore.refreshVersion
    const dispose2 = pagesStore.subscribe(() => {
      if (last !== pagesStore.refreshVersion) {
        last = pagesStore.refreshVersion
        if (dispose) dispose()
        dispose = cb({ isRefreshing: true, item: props.item })
      }
    })

    return () => {
      dispose && dispose()
      dispose2()
    }
  }, [props.isActive, ...mountArgs])
}
