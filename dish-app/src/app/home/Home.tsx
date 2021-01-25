import { reaction } from '@dish/use-store'
import React, { Suspense, memo, useEffect } from 'react'

import { router } from '../../router'
import { appMenuStore } from '../AppMenuStore'
import { HomeContainer } from './HomeContainer'
import { HomeStackView } from './HomeStackView'
import { HomeStackViewPages } from './HomeStackViewPages'

export const Home = memo(function Home() {
  // helper that warns on root level unmounts (uncaught suspense)
  if (process.env.NODE_ENV === 'development') {
    useEffect(() => {
      return () => {
        console.warn('\n\nUNCAUGHT SUSPENSE SOMEWHERE -- FIX IT!!\n\ns')
      }
    }, [])
  }

  useEffect(() => {
    return reaction(
      router as any,
      (x) => {
        return x.curPage.name
      },
      (name) => {
        if (name == 'login' || name == 'register' || name == 'passwordReset') {
          appMenuStore.show()
        }
      }
    )
  }, [])

  return (
    <Suspense fallback={null}>
      <HomeContainer>
        <HomeStackView>
          {(props) => {
            return <HomeStackViewPages {...props} />
          }}
        </HomeStackView>
      </HomeContainer>
    </Suspense>
  )
})
