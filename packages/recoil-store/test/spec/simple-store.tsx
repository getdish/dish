import React from 'react'

import { RecoilRoot, Store, get, useRecoilStore } from '../../_'

const sleep = () => new Promise((res) => setTimeout(res, 100))

// TODO testing using in combination
class CustomTodoList extends Store<{ namespace: string }> {
  todoList = get(TodoList, this.props.namespace)

  get items() {
    return this.todoList.items
  }
}

type Todo = { text: string; done: boolean }

class TodoList extends Store<{
  namespace: string
}> {
  items: Todo[] = [{ text: 'hi', done: false }]

  get itemsDiff() {
    return this.items.map((x, i) => i)
  }

  add() {
    this.items = [
      ...this.items,
      { text: `item-${this.items.length}`, done: false },
    ]
  }

  async asyncAdd() {
    await sleep()
    this.add()
  }
}

export function SimpleStoreTest() {
  return (
    <RecoilRoot initializeState={null}>
      <SimpleStoreTestComponent />
    </RecoilRoot>
  )
}

type x = typeof TodoList

function SimpleStoreTestComponent() {
  const store = useRecoilStore(TodoList, {
    namespace: 'hello',
  })
  return (
    <>
      <div id="x">{store.items[store.items.length - 1].text}</div>
      <div id="y">{store.itemsDiff[store.itemsDiff.length - 1]}</div>
      <button id="add" onClick={() => store.add()}></button>
      <button id="add-async" onClick={() => store.asyncAdd()}></button>
    </>
  )
}
