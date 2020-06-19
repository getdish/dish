export const inputGetNode = (instance: any): HTMLInputElement | null => {
  return instance?.['_node'] ?? null
}

export const inputCaretPosition = (input?: HTMLInputElement) => {
  const focusedInput = document.activeElement
  if (focusedInput !== input) {
    return false
  }
  if (input.selectionStart === input.selectionEnd) {
    return false
  }
  return input.selectionStart
}

export const inputClearSelection = (input?: HTMLInputElement) => {
  if (document.activeElement == input) {
    if (window.getSelection()?.empty) {
      // Chrome
      window.getSelection()?.empty()
    } else if (window.getSelection()?.removeAllRanges) {
      // Firefox
      window.getSelection()?.removeAllRanges()
    }
  }
}

export const inputIsTextSelected = (input?: HTMLInputElement) => {
  const selection = window.getSelection()
  if (input && selection?.anchorNode?.firstChild !== input) return
  return !selection?.empty
}

export const inputSelectAll = (input?: HTMLInputElement) => {
  if (input instanceof HTMLInputElement) {
    input.select()
  }
}
