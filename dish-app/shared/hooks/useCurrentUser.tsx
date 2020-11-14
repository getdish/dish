import { useOvermind } from '../state/useOvermind'

export function useCurrentUser() {
  const om = useOvermind()
  return om.state.user.user
}

export function useCurrentUserId() {
  return useCurrentUser()?.id ?? null
}
