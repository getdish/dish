import React from 'react'

import { useRecoilStore } from '../../_'

const sleep = () => new Promise((res) => setTimeout(res, 100))

class SimpleStore {
  x = 0

  get y() {
    return this.x + 1
  }

  add() {
    console.log('adding')
    this.x++
  }

  async asyncAdd() {
    await sleep()
    this.add()
  }
}

export function SimpleStoreTest() {
  const store = useRecoilStore(SimpleStore)
  console.log('store', store)
  return (
    <>
      <div id="x">{store.x}</div>
      <button id="add" onClick={() => store.add()}></button>
      <button id="asyncAdd" onClick={() => store.asyncAdd()}></button>
    </>
  )
}
