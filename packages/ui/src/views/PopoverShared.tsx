import { createContext } from 'react'

export const PopoverShowContext = createContext<boolean | null>(null)

export const popoverCloseCbs = new Set<Function>()
export const closeAllPopovers = () => {
  popoverCloseCbs.forEach((cb) => cb())
  popoverCloseCbs.clear()
}

const handleKeyDown = (e) => {
  if (e.keyCode == 27) {
    // esc
    if (popoverCloseCbs.size) {
      const [first] = [...popoverCloseCbs]
      first?.(false)
      popoverCloseCbs.delete(first)
      e.preventDefault()
    }
  }
}

window.addEventListener('keydown', handleKeyDown)
