import { Store, compareStrict, useStore } from '@dish/use-store'
import React, { Suspense, useLayoutEffect } from 'react'

type PortalStoreProps = { id: 'root' | 'drawer' }
type PortalItemProps = { children: any }

class PortalStore extends Store<PortalStoreProps> {
  @compareStrict
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

function usePortalItem({ children, id }: PortalItemProps & PortalStoreProps) {
  const portalStore = useStore(PortalStore, { id })
  useLayoutEffect(() => {
    const key = `${Math.random()}`
    portalStore.setItem(key, children)
    return () => {
      portalStore.removeItem(key)
    }
  }, [])
}

export function PortalItem(props: PortalItemProps & PortalStoreProps) {
  usePortalItem(props)
  return null
}

export function PortalProvider({ id }: PortalStoreProps) {
  const portalStore = useStore(PortalStore, { id })
  return (
    <>
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

export const RootPortalItem = (props: PortalItemProps) => <PortalItem {...props} id="root" />
export const RootPortalProvider = (props: { children?: any }) => (
  <PortalProvider {...props} id="root" />
)

export const DrawerPortalItem = (props: PortalItemProps) => <PortalItem {...props} id="drawer" />
export const DrawerPortalProvider = (props: { children?: any }) => (
  <PortalProvider {...props} id="drawer" />
)
