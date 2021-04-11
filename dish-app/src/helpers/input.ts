import { Platform } from 'react-native'

export const inputGetNode = (instance: any): HTMLInputElement | null => {
  if (Platform.OS !== 'web') {
    return instance
  }
  return (instance instanceof HTMLElement ? instance : instance?.['_node']) ?? null
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

export const inputIsTextSelected = (input?: HTMLInputElement | null) => {
  const selection = window.getSelection()
  if (input && selection?.anchorNode?.firstChild !== input) return undefined
  return !selection?.empty
}

export const inputSelectAll = (input?: HTMLInputElement) => {
  if (input instanceof HTMLInputElement) {
    input.select()
  }
}
