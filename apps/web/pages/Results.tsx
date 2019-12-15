import { useMutation, useQuery } from 'urql'

export function Results() {
  const [dishes] = useQuery({
    query: `{
      dish {
        name
      }
    }
    `,
  })
  const [result, executeMutation] = useMutation(
    `mutation {
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
      {!dishes.fetching && (
        <ul>
          {dishes.data.dish.map((dish, i) => (
            <li key={i}>
              <h3>
                {i}. {dish.name}
              </h3>
            </li>
          ))}
        </ul>
      )}
      dishes
      <pre>{JSON.stringify(dishes, null, 2)}</pre>
      result
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  )
}
