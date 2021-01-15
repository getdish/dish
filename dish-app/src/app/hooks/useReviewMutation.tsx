import { mutation } from '@dish/graph'
import { useCallback } from 'react'

export const useReviewMutation = () => {
  return useCallback((args) => {
    mutation.insert_review(args)
  }, [])
}
