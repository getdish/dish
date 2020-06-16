import React from 'react'

import { RecoilRoot, Store, get, useRecoilStore } from '../../_'

const sleep = () => new Promise((res) => setTimeout(res, 100))

// TODO testing using in combination
class CustomTodoList extends Store<{ id: number }> {
  todoList = get(TodoList, this.props.id)

  get items() {
    return this.todoList.items
  }
}

type Todo = { text: string; done: boolean }

class TodoList extends Store<{
  id: number
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

export function SimpleStoreTest({ id }: { id: number }) {
  return (
    <RecoilRoot initializeState={null}>
      <SimpleStoreTestComponent key={id} id={id} />
    </RecoilRoot>
  )
}

type x = typeof TodoList

function SimpleStoreTestComponent(props: { id: number }) {
  const store = useRecoilStore(TodoList, props)
  return (
    <>
      <div id="x">{store.items[store.items.length - 1].text}</div>
      <div id="y">{store.itemsDiff[store.itemsDiff.length - 1]}</div>
      <button id="add" onClick={() => store.add()}></button>
      <button id="add-async" onClick={() => store.asyncAdd()}></button>
    </>
  )
}
