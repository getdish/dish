import { Store, createUseStore } from '@dish/use-store'

class ColumnSelectionStore extends Store<{ id: string }> {
  column = 0
  setColumn(column: number) {
    this.column = column
  }
}

class RowSelectionStore extends Store<{ id: string; column: number }> {
  row = 0
  setRow(row: number) {
    this.row = row
  }
}

export const useColumnStore = createUseStore(ColumnSelectionStore)
export const useRowStore = createUseStore(RowSelectionStore)
