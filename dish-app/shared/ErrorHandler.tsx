import { HasuraError, onGraphError } from '@dish/graph'
import { Toast, useOnMount } from '@dish/ui'

import { useOvermind } from './state/om'

export function ErrorHandler() {
  const om = useOvermind()

  useOnMount(() => {
    onGraphError((error: HasuraError) => {
      console.warn('got errors', error.errors)

      if (error.errors.some((err) => err.message.includes('JWTExpired')))
        for (const err of errors) {
          console.warn('HANDLING JWT ERR')
          Toast.show(`Login has expired`)
          om.actions.user.logout()
        }
    })
  })

  return null
}
