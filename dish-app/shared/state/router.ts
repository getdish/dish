import { HistoryItem } from '@dish/router'
import { Action, derived } from 'overmind'

import { OmState } from './home-types'
import { router } from './router.1'

export type OnRouteChangeCb = (item: HistoryItem) => Promise<void>

const start: Action = (om) => {
  router.onRouteChange((item) => {
    om.actions.router._update()
    om.actions.home.handleRouteChange(item)
  })
  router.mount()
}

type RouterState = {
  _update: number
  curPage: HistoryItem
  curPageName: string
}

export const state: RouterState = {
  _update: 0,
  curPage: derived<RouterState, OmState, HistoryItem>((state) => {
    state._update
    return router.curPage
  }),
  curPageName: derived<RouterState, OmState, string>((state) => {
    state._update
    return state.curPage.name
  }),
}

const _update: Action = (om) => {
  om.state.router._update += 1
}

export const actions = {
  start,
  _update,
}
