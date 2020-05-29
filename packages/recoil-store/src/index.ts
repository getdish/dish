import { useMemo } from 'react'

export function useRecoilStore<A>(store: new () => A): A {
  const recoilStore = getRecoilStateFromStore(store)
  return useMemo(() => {
    return new store()
  }, [])
}

function getRecoilStateFromStore(store: any) {
  const attrs = Object.keys(store)
  const proto = Object.getOwnPropertyDescriptors(store)
  console.log('waht is', attrs, proto)
}
