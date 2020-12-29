import { omit } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { useGet } from 'snackui'

import { router } from '../../state/router'

export const useSelectedDish = (tagName?: string | null) => {
  const [selectedDish, setSelectedDish] = useState(tagName ?? '')
  const getSelectedDish = useGet(selectedDish)

  useEffect(() => {
    setSelectedDish(tagName)
  }, [tagName])

  const setSelectedDishToggle = useCallback((name: string) => {
    const cur = getSelectedDish()
    const next = cur === name ? '' : name
    const curParams = router.curPage.params
    const params = next
      ? {
          ...curParams,
          section: 'reviews',
          sectionSlug: name,
        }
      : omit(curParams, 'reviews')
    console.log('navigate', params)
    router.navigate({
      name: router.curPage.name,
      params,
    })
    setSelectedDish(next)
  }, [])
  return { selectedDish, setSelectedDishToggle }
}
