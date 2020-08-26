import { onGraphError } from '@dish/graph'
import { Toast, useOnMount } from '@dish/ui'

import { useOvermind } from './state/om'

export function ErrorHandler() {
  const om = useOvermind()

  useOnMount(() => {
    onGraphError((errors) => {
      console.warn('got errors', errors)

      if (errors.some((err) => err.message.includes('JWTExpired')))
        for (const err of errors) {
          console.warn('HANDLING JWT ERR')
          Toast.show(`Login has expired`)
          om.actions.user.logout()
        }
    })
  })

  return null
}
