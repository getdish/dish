import { Store, useRecoilStore } from '@dish/use-store'
import immer from 'immer'

class SelectionStore extends Store<{ id: string }> {
  selectedIndices = [0, 0]
  selectedNames = [] as string[]

  setSelected(indices: [number, number]) {
    this.selectedIndices = indices
  }

  setSelectedName(row: number, name: string) {
    this.selectedNames = immer(this.selectedNames, (next) => {
      next[row] = name
    })
  }
}

export const useSelectionStore = (id: string) => {
  return useRecoilStore(SelectionStore, { id })
}

export const useTagSelectionStore = () => {
  return useSelectionStore('tag')
}

export const useReviewSelectionStore = () => {
  return useSelectionStore('review')
}
