import { useMutation, useQuery } from 'urql'

export function Results() {
  const [dishes] = useQuery({
    query: `query MyQuery {
      __typename
      dish_aggregate {
        nodes {
          name
          id
          updated_at
        }
      }
    }`,
  })
  const [result, executeMutation] = useMutation(
    `mutation MyMutation {
      __typename
      insert_dish(objects: {name: "hello world"})
    }`,
  )

  return (
    <div>
      <button
        onClick={() => {
          console.log('got')
          executeMutation()
        }}
      >
        Add
      </button>
      <ul>
        {/* {( ?? []).map((dish, i) => (
          <li key={i}>
            <h3>Search result {i}</h3>
            <p>
              <code>
                <pre>{JSON.stringify(dish, null, 2)}</pre>
              </code>
            </p>
          </li>
        ))} */}
      </ul>
      dishes
      <pre>{JSON.stringify(dishes, null, 2)}</pre>
      result
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
