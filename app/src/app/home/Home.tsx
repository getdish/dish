import { searchBarHeight } from '../../constants/constants'
import { router } from '../../router'
import { AppAutocompleteSearch } from '../AppAutocompleteSearch'
import { appMenuStore } from '../AppMenuStore'
import { autocompletesStore } from '../AutocompletesStore'
import { HomeDrawer } from './HomeDrawer'
import { HomeStackView } from './HomeStackView'
import { HomeStackViewPages } from './HomeStackViewPages'
import { YStack, isWeb } from '@dish/ui'
import { useGlobalStore, useReaction } from '@tamagui/use-store'
import React, { Suspense, memo, useEffect } from 'react'

export const Home = memo(() => {
  const { visible: autocompleteVisible } = useGlobalStore(autocompletesStore)
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
    <HomeDrawer showAutocomplete={autocompleteVisible}>
      <Suspense fallback={null}>
        <YStack zi={10000000000} fullscreen top={isWeb ? searchBarHeight : 0} pe="none">
          <AppAutocompleteSearch />
        </YStack>
        <HomeStackView limitVisibleStates={autocompleteVisible ? 1 : Infinity}>
          {(props) => {
            return <HomeStackViewPages {...props} />
          }}
        </HomeStackView>
      </Suspense>
    </HomeDrawer>
  )
})
