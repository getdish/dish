import { RecoilRoot } from '@dish/recoil-store'
import React from 'react'

import { ProvideRouter, Route, useRouter } from '../../_'

const routes = {
  home: new Route('/'),
  user: new Route<{ username: string; pane?: string }>('/u/:username/:pane?'),
  gallery: new Route<{ restaurantSlug: string; dishId?: string }>(
    '/gallery/:restaurantSlug/:dishId?'
  ),
  login: new Route('/login'),
  restaurant: new Route<{ slug: string }>('/restaurant/:slug'),
  // NOTE keep userSearch and search in sync
  // after user/restaurant
  notFound: new Route('*'),
}

export function RecoilStoreRouterTest1() {
  return (
    <RecoilRoot>
      <ProvideRouter routes={routes}>
        <Component1 />
      </ProvideRouter>
    </RecoilRoot>
  )
}

function Component1() {
  const store = useRouter()
  return (
    <>
      <div id="curPageName">{store.curPage.name}</div>
      <div id="curPageParams">{JSON.stringify(store.curPage.params)}</div>
      <button
        id="navigate"
        onClick={() => {
          if (store.curPage.name === 'home') {
            store.navigate({
              name: 'login',
            })
          }
          if (store.curPage.name === 'login') {
            store.navigate({
              name: 'user',
              // @ts-ignore
              params: {
                username: 'test',
                pane: 'pane',
              },
            })
          }
        }}
      ></button>
    </>
  )
}
