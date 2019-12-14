import { useQuery } from 'urql'

export function Results() {
  const [results] = useQuery({
    query: `{ something }`,
  })
  console.log('results', results)

  return (
    <div>
      <ul>
        <li>
          <h3>Search result 1</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eusmod tempor incididunt ut labore epstein didn't kill himself.
          </p>
        </li>
      </ul>
    </div>
  )
}
