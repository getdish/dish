import React, { StrictMode } from 'react'

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
    <StrictMode>
      <ProvideRouter routes={routes}>
        <Component1 />
      </ProvideRouter>
    </StrictMode>
  )
}

function Component1() {
  const router = useRouter()
  console.log('NOW AT', router.curPage.name, router.stack, router.stackIndex)
  return (
    <>
      <div id="curPageName">{router.curPage.name}</div>
      <div id="curPageParams">{JSON.stringify(router.curPage.params)}</div>
      <button
        id="back"
        onClick={() => {
          router.back()
        }}
      ></button>
      <button
        id="navigate"
        onClick={() => {
          if (router.curPage.name === 'home') {
            router.navigate({
              name: 'login',
            })
          } else if (router.curPage.name === 'login') {
            router.navigate({
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
