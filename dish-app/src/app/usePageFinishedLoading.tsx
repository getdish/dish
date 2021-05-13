import { useIsFullyIdle } from './hooks/useIsFullyIdle'

export const usePageFinishedLoading = () => {
  return useIsFullyIdle({ checks: 4, max: 100 })
}
