import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { last } from 'lodash'
import React, { StrictMode } from 'react'

import { Store, useStore } from '../_'

Error.stackTraceLimit = Infinity

async function testSimpleStore(id: number) {
  const { getAllByTitle } = render(
    <StrictMode>
      <SimpleStoreTest id={id} />
    </StrictMode>
  )

  const getCurrentByTitle = (name: string) => last(getAllByTitle(name))!

  const findX = () => getCurrentByTitle('x').innerHTML
  expect(findX()).toBe('hi')
  // click
  // console.log('add')
  act(() => {
    fireEvent.click(getCurrentByTitle('add'))
  })
  expect(findX()).toBe('item-1')
  // click twice
  // console.log('add2')
  act(() => {
    fireEvent.click(getCurrentByTitle('add'))
  })
  expect(findX()).toBe('item-2')
  // async click
  act(() => {
    fireEvent.click(getCurrentByTitle('addAsync'))
  })
  expect(findX()).toBe('item-2')
  await new Promise((res) => setTimeout(res, 110))
  expect(findX()).toBe('item-3')
}

// be sure ids are not same across tests...

describe('basic tests', () => {
  afterEach(cleanup)

  it('creates a simple store and action works', async () => {
    await testSimpleStore(0)
  })

  it('creates a second store under diff namespace both work', async () => {
    await testSimpleStore(1)
    await testSimpleStore(2)
  })

  it('updates a component in a different tree', async () => {
    const { getAllByTitle } = render(
      <StrictMode>
        <SimpleStoreTest id={4} />
        <SimpleStoreTest2 id={4} />
      </StrictMode>
    )
    const getCurrentByTitle = (name: string) => last(getAllByTitle(name))!
    act(() => {
      fireEvent.click(getCurrentByTitle('add'))
    })
    expect(getCurrentByTitle('x').innerHTML).toBe('item-1')
    expect(getCurrentByTitle('x2').innerHTML).toBe('item-1')
  })

  it('properly updates get values', () => {
    const { getAllByTitle } = render(
      <StrictMode>
        <SimpleStoreTest id={3} />
      </StrictMode>
    )
    const findY = () => getAllByTitle('y')[0].innerHTML
    expect(findY()).toBe('0')
    fireEvent.click(getAllByTitle('add')[0])
    expect(findY()).toBe('1')
  })

  it('only re-renders tracked properties', async () => {
    let renderCount = 0
    function SimpleStoreTestUsedProperties(props: { id: number }) {
      const store = useStore(TodoList, props)
      renderCount++
      return <button title="add" onClick={() => store.add()}></button>
    }
    const { getAllByTitle } = render(
      <StrictMode>
        <SimpleStoreTestUsedProperties id={5} />
      </StrictMode>
    )
    const getCurrentByTitle = (name: string) => last(getAllByTitle(name))!
    act(() => {
      fireEvent.click(getCurrentByTitle('add'))
      fireEvent.click(getCurrentByTitle('add'))
      fireEvent.click(getCurrentByTitle('add'))
    })
    expect(renderCount).toEqual(1)
  })
})

function SimpleStoreTest(props: { id: number }) {
  const store = useStore(TodoList, props)
  // console.log('render', props.id, store.lastItem.text)
  return (
    <>
      <div title="x">{store.lastItem.text}</div>
      <div title="y">{store.itemsDiff[store.itemsDiff.length - 1]}</div>
      <button title="add" onClick={() => store.add()}></button>
      <button title="addAsync" onClick={() => store.asyncAdd()}></button>
    </>
  )
}

function SimpleStoreTest2(props: { id: number }) {
  const store = useStore(TodoList, props)
  return <div title="x2">{store.lastItem.text}</div>
}

const sleep = (x = 100) => new Promise((res) => setTimeout(res, x))
type Todo = { text: string; done: boolean }

class TodoList extends Store<{
  id: number
}> {
  items: Todo[] = [{ text: 'hi', done: false }]

  get itemsDiff() {
    return this.items.map((x, i) => i)
  }

  get lastItem() {
    return this.items[this.items.length - 1]
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

// // TODO testing using in combination
// class CustomTodoList extends Store<{ id: number }> {
//   todoList = get(TodoList, this.props.id)

//   get items() {
//     return this.todoList.items
//   }
// }
