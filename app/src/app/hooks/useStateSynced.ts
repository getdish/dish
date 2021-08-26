import { getKey } from '@dish/use-store'
import { useEffect, useState } from 'react'

export const useStateSynced = <A>(next: A) => {
  const [cur, set] = useState(next)

  useEffect(() => {
    if (next !== cur) {
      set(next)
    }
  }, [next])

  return [cur, set] as const
}

// export const useStateObjectSynced = <A extends Object>(next: A) => {
//   const [cur, set] = useState(next)

//   useEffect(() => {
//     let next2 = {}
//     for (const key in next) {
//       if (!(key in cur) || cur[key] !== next[key]) {
//         next2 = next[key]
//       }
//     }
//     if (next !== cur) {
//       set(next)
//     }
//   }, [getKey(next)])

//   return [cur, set] as const
// }
