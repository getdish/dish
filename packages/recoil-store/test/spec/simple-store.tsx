import React from 'react'

import * as RecoilStore from '../../src'

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
  const store = RecoilStore.useRecoilStore(SimpleStore)
  return (
    <>
      <div id="x">{store.x}</div>
      <button id="add" onClick={() => store.add()}></button>
      <button id="asyncAdd" onClick={() => store.asyncAdd()}></button>
    </>
  )
}
