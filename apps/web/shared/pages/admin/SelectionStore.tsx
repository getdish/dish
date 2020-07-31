import { Store, useRecoilStore } from '@dish/use-store'

class SelectionStore extends Store<{ id: string }> {
  selectedIndices = [0, 0]
  selectedNames = [] as string[]

  setSelected(indices: [number, number]) {
    this.selectedIndices = indices
  }

  setSelectedName(row: number, name: string) {
    if (typeof row === 'number') {
      this.selectedNames[row] = name
      this.selectedNames = [...this.selectedNames]
    }
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
