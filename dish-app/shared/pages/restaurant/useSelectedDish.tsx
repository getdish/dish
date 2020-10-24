import { useCallback, useState } from 'react'
import { useGet } from 'snackui'

export const useSelectedDish = (tagName?: string) => {
  const [selectedDish, setSelectedDish] = useState(tagName)
  const getSelectedDish = useGet(selectedDish)
  const setSelectedDishToggle = useCallback((name: string) => {
    const cur = getSelectedDish()
    if (cur === name) {
      setSelectedDish(null)
    } else {
      setSelectedDish(name)
    }
  }, [])
  return { selectedDish, setSelectedDishToggle }
}
