import React from 'react'

import { useRecoilStore } from '../../_'

const sleep = () => new Promise((res) => setTimeout(res, 100))
function get<A>(_: A, b?: any): A extends new () => infer B ? B : A {
  return _ as any
}

type Todo = { text: string; done: boolean }

class Store<A> {
  // @ts-ignore
  props: A
}

class TodoList extends Store<{
  namespace: string
}> {
  items: Todo[] = [{ text: 'hi', done: false }]

  get itemsDiff() {
    return this.items.map((x) => 1)
  }

  add() {
    console.log('adding')
    this.items = [...this.items, { text: '', done: false }]
  }

  async asyncAdd() {
    await sleep()
    this.add()
  }
}

class CustomTodoList extends Store<{ namespace: string }> {
  todoList = get(TodoList, this.props.namespace)

  get items() {
    return this.todoList.items
  }
}

export function SimpleStoreTest() {
  const store = useRecoilStore(TodoList, {
    namespace: 'hello',
  })

  console.log('store', store)
  return (
    <>
      <div id="x">{store.items[0].text}</div>
      <button id="add" onClick={() => store.add()}></button>
      <button id="asyncAdd" onClick={() => store.asyncAdd()}></button>
    </>
  )
}
