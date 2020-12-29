import { Toast } from 'snackui'

import { appMenuStore } from '../AppMenuStore'
import { om } from '../state/om'

export const promptLogin = () => {
  const user = om.state.user.user
  if (!user || !om.state.user.isLoggedIn) {
    appMenuStore.show()
    Toast.show(`Signup/login to do this`)
    return true
  }
  return false
}
