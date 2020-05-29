import { useMemo } from 'react'

export function useRecoilStore<A>(store: A): A {
  const recoilStore = getRecoilStateFromStore(store)
  return useMemo(() => {
    return store
  }, [])
}

function getRecoilStateFromStore(store: any) {
  const attrs = Object.keys(store)
  const proto = Object.getOwnPropertyDescriptors(store)
  console.log('waht is', attrs, proto)
}
