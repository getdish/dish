import { useCallback, useEffect, useState } from 'react'
import { useGet } from 'snackui'

import { router } from '../../../router'

export const useSelectedDish = (tagName?: string | null) => {
  const [selectedDish, setSelectedDish] = useState(tagName ?? '')
  const getSelectedDish = useGet(selectedDish)

  useEffect(() => {
    setSelectedDish(tagName)
  }, [tagName])

  const setSelectedDishToggle = useCallback((name: string | null) => {
    const cur = getSelectedDish()
    const next = cur === name ? '' : name
    const { section, sectionSlug, ...restParams } = router.curPage.params
    const params = next
      ? {
          ...restParams,
          section: 'reviews',
          sectionSlug: name,
        }
      : restParams
    router.navigate({
      name: router.curPage.name as any,
      params,
      replace: true,
    })
    setSelectedDish(next)
  }, [])
  return { selectedDish, setSelectedDishToggle }
}
