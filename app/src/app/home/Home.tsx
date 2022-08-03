import { router } from '../../router'
import { appMenuStore } from '../AppMenuStore'
import { autocompletesStore } from '../AutocompletesStore'
import { HomeDrawer } from './HomeDrawer'
import { HomeStackView } from './HomeStackView'
import { HomeStackViewPages } from './HomeStackViewPages'
import { reaction, useStoreInstance } from '@dish/use-store'
import React, { Suspense, memo, useEffect } from 'react'

export const Home = memo(function Home() {
  const { visible: autocompleteVisible } = useStoreInstance(autocompletesStore)

  // helper that warns on root level unmounts (uncaught suspense)
  if (process.env.NODE_ENV === 'development') {
    useEffect(() => {
      return () => {
        console.warn('🏡🏡🏡 Home UNCAUGHT SUSPENSE SOMEWHERE -- FIX IT!!\n\ns')
      }
    }, [])
  }

  useEffect(() => {
    return reaction(
      router as any,
      (x) => {
        return x.curPage.name
      },
      function appMenuShow(name) {
        if (name == 'login' || name == 'register' || name == 'passwordReset') {
          appMenuStore.show()
        }
      }
    )
  }, [])

  return (
    <Suspense fallback={null}>
      <HomeDrawer showAutocomplete={autocompleteVisible}>
        <HomeStackView limitVisibleStates={autocompleteVisible ? 0 : Infinity}>
          {(props) => {
            return <HomeStackViewPages {...props} />
          }}
        </HomeStackView>
      </HomeDrawer>
    </Suspense>
  )
})
