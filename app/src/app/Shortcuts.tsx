import { memo, useEffect } from 'react'

import { router } from '../router'
import { focusSearchInput, getSearchInput } from './AppSearchInput'
import { homeStore } from './homeStore'

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