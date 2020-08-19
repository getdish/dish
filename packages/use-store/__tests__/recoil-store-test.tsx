import { cleanup, fireEvent, render } from '@testing-library/react'
import { last } from 'lodash'
import React, { StrictMode, useLayoutEffect, useReducer } from 'react'
import { createContainer } from 'react-tracked'

import { Store, UseStoreRoot, useStore } from '../_'

Error.stackTraceLimit = Infinity

async function testSimpleStore(id: number) {
  const { getAllByTitle } = render(
    <StrictMode>
      <UseStoreRoot>
        <SimpleStoreTest id={id} />
      </UseStoreRoot>
    </StrictMode>
  )

  const getCurrentByTitle = (name: string) => last(getAllByTitle(name))!

  const findX = () => getCurrentByTitle('x').innerHTML
  expect(findX()).toBe('hi')
  // click
  fireEvent.click(getCurrentByTitle('add'))
  expect(findX()).toBe('item-1')
  // click twice
  fireEvent.click(getCurrentByTitle('add'))
  expect(findX()).toBe('item-2')
  // async click
  fireEvent.click(getCurrentByTitle('addAsync'))
  expect(findX()).toBe('item-2')
  await new Promise((res) => setTimeout(res, 110))
  expect(findX()).toBe('item-3')
}

// be sure ids are not same across tests...

describe('basic tests', () => {
  afterEach(cleanup)

  it('verifies react-tracked supports tracking before insert', () => {
    const useValue = ({ reducer, initialState }) =>
      useReducer(reducer, initialState)
    const { Provider, useTracked } = createContainer<any, any, any>(useValue)

    const initialState = {}
    const App = () => {
      return (
        <Provider reducer={reducer} initialState={initialState}>
          <Component />
        </Provider>
      )
    }

    const reducer = (state: any, action: any) => {
      return {
        ...state,
        ...action.next,
      }
    }

    const Component = () => {
      const [store, dispatch] = useTracked()

      useLayoutEffect(() => {
        dispatch({ next: { x: 1 } })
      }, [])

      return (
        <>
          <div title="test">{store.x ?? 'none'}</div>
          <button
            title="add"
            onClick={() => {
              dispatch({ next: { x: 2 } })
            }}
          />
        </>
      )
    }

    const t1 = render(<App />)
    expect(t1.getAllByTitle('test')[0].innerHTML).toBe('1')
    fireEvent.click(t1.getAllByTitle('add')[0])
    expect(t1.getAllByTitle('test')[0].innerHTML).toBe('2')
  })

  it('creates a simple store and action works', async () => {
    await testSimpleStore(0)
  })

  it('creates a second store under diff namespace both work', async () => {
    await testSimpleStore(1)
    await testSimpleStore(2)
  })

  it('properly updates get values', () => {
    const { getAllByTitle } = render(
      <StrictMode>
        <UseStoreRoot>
          <SimpleStoreTest id={3} />
        </UseStoreRoot>
      </StrictMode>
    )
    const findY = () => getAllByTitle('y')[0].innerHTML
    expect(findY()).toBe('0')
    fireEvent.click(getAllByTitle('add')[0])
    expect(findY()).toBe('1')
  })
})

function SimpleStoreTest(props: { id: number }) {
  const store = useStore(TodoList, props)
  // console.log('store.lastItem', props.id, store.lastItem.text)
  return (
    <>
      <div title="x">{store.lastItem.text}</div>
      <div title="y">{store.itemsDiff[store.itemsDiff.length - 1]}</div>
      <button title="add" onClick={() => store.add()}></button>
      <button title="addAsync" onClick={() => store.asyncAdd()}></button>
    </>
  )
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
