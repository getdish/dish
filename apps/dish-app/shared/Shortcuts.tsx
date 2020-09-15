import { memo, useEffect } from 'react'

import { focusSearchInput, getSearchInput } from './pages/home/HomeSearchInput'
import { omStatic } from './state/omStatic'

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
          if (omStatic.state.home.currentStateType === 'gallery') {
            omStatic.actions.home.popBack()
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
