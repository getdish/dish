import {
  RecoilState,
  RecoilValueReadOnly,
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useRecoilInterface,
} from '@o/recoil'
import { useEffect, useMemo, useRef } from 'react'

import { Store } from './Store'

export { RecoilRoot } from '@o/recoil'
export * from './Store'

export function get<A>(
  _: A,
  b?: any
): A extends new (props?: any) => infer B ? B : A {
  return _ as any
}

type StoreAttribute =
  | { type: 'value'; key: string; value: RecoilState<any> }
  | { type: 'action'; key: string; value: Function }
  | {
      type: 'selector'
      key: string
      value: RecoilValueReadOnly<unknown>
    }

type StoreAttributes = { [key: string]: StoreAttribute }

const keys = new Set<string>()

export function useRecoilStore<A extends Store<B>, B>(
  StoreKlass: new (props: B) => A | (new () => A),
  props?: B
): A {
  const [storeInstance, attrs] = useStoreInstance(StoreKlass, props)
  const { getSetRecoilState, getRecoilValue } = useRecoilInterface()
  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  return useMemo(() => {
    return new Proxy(storeInstance as A, {
      get(target, key) {
        return getProxyValue(target, key, attrs, getRecoilValue)
      },
      set(target, key, value, receiver) {
        if (isMounted.current === false) {
          return true
        }
        if (typeof key === 'string') {
          const prev = getRecoilValue(attrs[key].value)
          if (prev !== value) {
            const setter = getSetRecoilState(attrs[key].value)
            setter(value)
            Reflect.set(target, key, value, receiver)
          }
          return true
        }
        return Reflect.set(target, key, value, receiver)
      },
    })
  }, [])
}

const cache = {}
function useStoreInstance(StoreKlass: any, props: any) {
  const propsKey = props ? JSON.stringify(props) : ''
  const cached = cache[StoreKlass]?.[propsKey]
  if (cached) {
    return cached
  }

  const storeName = StoreKlass.name
  if (keys.has(storeName)) {
    throw new Error(`Store name already used`)
  }
  const storeInstance = new StoreKlass(props as any)
  const descriptors = getStoreDescriptors(storeInstance)
  const attrs: StoreAttributes = {}
  const storeProxy = new Proxy(storeInstance as any, {
    get(target, key) {
      return getProxyValue(target, key, attrs, curGetter)
    },
  })
  for (const prop in descriptors) {
    attrs[prop] = getDescription(
      storeProxy,
      `${storeName}/${prop}/${propsKey}`,
      descriptors[prop]
    )
  }
  cache[StoreKlass] = cache[StoreKlass] ?? {}
  cache[StoreKlass][propsKey] = [storeInstance, attrs]
  return [storeInstance, attrs]
}

let curGetter: any = null

function getDescription(
  target: any,
  key: string,
  descriptor: TypedPropertyDescriptor<any>
): StoreAttribute {
  if (typeof descriptor.value === 'function') {
    return {
      type: 'action',
      key,
      value: descriptor.value,
    }
  } else if (typeof descriptor.get === 'function') {
    return {
      type: 'selector',
      key,
      value: selector({
        key,
        get: ({ get }) => {
          curGetter = get
          const res = descriptor.get!.call(target)
          return res
        },
      }),
    }
  }
  return {
    type: 'value',
    key,
    value: atom({
      key,
      default: descriptor.value,
    }),
  }
}

function getProxyValue(
  target: any,
  key: string | number | symbol,
  attrs: StoreAttributes,
  getter: Function
) {
  if (typeof key === 'string') {
    switch (attrs[key].type) {
      case 'action':
        return attrs[key].value
      case 'value':
      case 'selector':
        return getter(attrs[key].value)
    }
  }
  return Reflect.get(target, key)
}

function getStoreDescriptors(storeInstance: any) {
  const proto = Object.getPrototypeOf(storeInstance)
  const instanceDescriptors = Object.getOwnPropertyDescriptors(storeInstance)
  const protoDescriptors = Object.getOwnPropertyDescriptors(proto)
  const descriptors = {
    ...protoDescriptors,
    ...instanceDescriptors,
  }
  // @ts-ignore
  delete descriptors.constructor
  return descriptors
}
