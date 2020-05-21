import { Review, mutation } from '@dish/graph'
import { useCallback } from 'react'

export const useReviewMutation = () => {
  return useCallback((args) => {
    // @ts-ignore
    mutation.insert_review(args)
  }, [])
}
