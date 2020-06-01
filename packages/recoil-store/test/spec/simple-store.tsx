import React from 'react'

import { RecoilRoot, useRecoilStore } from '../../_'

const sleep = () => new Promise((res) => setTimeout(res, 100))
function get<A>(_: A, b?: any): A extends new () => infer B ? B : A {
  return _ as any
}

class Store<A> {
  // @ts-ignore
  props: A
}

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
    return this.items.map((x) => 1)
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
    <RecoilRoot>
      <SimpleStoreTestComponent />
    </RecoilRoot>
  )
}

function SimpleStoreTestComponent() {
  const store = useRecoilStore(TodoList, {
    namespace: 'hello',
  })
  return (
    <RecoilRoot>
      <div id="x">{store.items[store.items.length - 1].text}</div>
      <button id="add" onClick={() => store.add()}></button>
      <button id="add-async" onClick={() => store.asyncAdd()}></button>
    </RecoilRoot>
  )
}
