import { Store, useStore } from '@dish/use-store'
import React, { Suspense, useLayoutEffect } from 'react'

class AppPortalStore extends Store {
  items = {}

  setItem(key: string, item: any) {
    this.items = {
      ...this.items,
      [key]: item,
    }
  }

  removeItem(key: string) {
    delete this.items[key]
    this.items = { ...this.items }
  }
}

export function AppPortalProvider(props: { children: any }) {
  const portalStore = useStore(AppPortalStore)
  return (
    <>
      {props.children}
      {Object.keys(portalStore.items).map((key) => {
        const item = portalStore.items[key]
        return (
          <React.Fragment key={key}>
            <Suspense fallback={null}>{item}</Suspense>
          </React.Fragment>
        )
      })}
    </>
  )
}

export function AppPortalItem(props: { children: any }) {
  const portalStore = useStore(AppPortalStore)

  useLayoutEffect(() => {
    const key = `${Math.random()}`
    portalStore.setItem(key, props.children)
    return () => {
      portalStore.removeItem(key)
    }
  }, [])

  return null
}
