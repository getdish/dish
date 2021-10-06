import { isManualDebugMode } from '../constants'

export const fetchLog = (input: RequestInfo, init?: RequestInit | undefined): Promise<Response> => {
  if (isManualDebugMode || process.env.DEBUG || process.env.LOG_FETCH) {
    console.log(` [gqty]
      fetch('${input}', ${
      init ? JSON.stringify(init, null, 2) : undefined
    }).then(x => x.json()).then(console.log.bind(console))
`)
  }
  return fetch(input, init)
}
