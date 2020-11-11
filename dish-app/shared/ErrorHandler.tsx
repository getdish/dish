import { HasuraError, onGraphError } from '@dish/graph'
import { Toast, useOnMount } from 'snackui'

import { omStatic } from './state/omStatic'

export function ErrorHandler() {
  useOnMount(() => {
    onGraphError((error: HasuraError) => {
      const errors = error.errors
      console.warn('got errors', errors)

      if (errors.some((err) => err.message.includes('JWTExpired')))
        for (const err of errors) {
          console.warn('HANDLING JWT ERR')
          Toast.show(`Login has expired`)
          omStatic.actions.user.logout()
        }
    })
  })

  return null
}
