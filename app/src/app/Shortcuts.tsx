import { router } from '../router'
import { homeStore } from './homeStore'
import { focusSearchInput, getSearchInput } from './searchInputActions'
import { memo, useEffect } from 'react'

export const Shortcuts = memo(() => {
  useEffect(() => {
    const handleKeyUp = (e) => {
      // console.log('e', e.keyCode)

      switch (e.keyCode) {
        // forward-slash (/)
        case 191: {
          if (document.activeElement !== getSearchInput()) {
            focusSearchInput()
          }
          break
        }

        // esc
        case 27: {
          // TODO better system for this
          if (router.curPage.name === 'gallery') {
            homeStore.popBack()
          }
          break
        }
      }
    }

    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return null
})
