import { searchBarHeight } from '../../constants/constants'
import { router } from '../../router'
import { AppAutocompleteSearch } from '../AppAutocompleteSearch'
import { appMenuStore } from '../AppMenuStore'
import { autocompletesStore } from '../AutocompletesStore'
import { HomeDrawer } from './HomeDrawer'
import HomePage from './HomePage'
import { HomeStackView } from './HomeStackView'
import { HomeStackViewPages } from './HomeStackViewPages'
import { Square, YStack } from '@dish/ui'
import { useReaction, useStoreInstance } from '@dish/use-store'
import React, { Suspense, memo, useEffect } from 'react'

export const Home = memo(() => {
  const { visible: autocompleteVisible } = useStoreInstance(autocompletesStore)
  if (process.env.NODE_ENV === 'development') {
    useEffect(
      () => () => {
        console.warn('⚠️ this component should never unmount, uncaught suspense')
      },
      []
    )
  }

  useReaction(
    router,
    (x) => x.curPage.name,
    (name) => {
      if (name == 'login' || name == 'register' || name == 'passwordReset') {
        appMenuStore.show()
      }
    },
    undefined,
    []
  )

  return (
    <Suspense fallback={null}>
      <HomeDrawer showAutocomplete={autocompleteVisible}>
        <YStack fullscreen pt={searchBarHeight}>
          <YStack pos="relative" f={1}>
            <AppAutocompleteSearch />
          </YStack>
        </YStack>
        <HomeStackView limitVisibleStates={autocompleteVisible ? 0 : Infinity}>
          {(props) => {
            return <HomeStackViewPages {...props} />
          }}
        </HomeStackView>
      </HomeDrawer>
    </Suspense>
  )
})
