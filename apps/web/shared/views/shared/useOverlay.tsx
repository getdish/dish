import { useLayoutEffect } from 'react'

export const useOverlay = ({
  zIndex = 1,
  isOpen,
  onClick,
}: {
  isOpen: boolean
  onClick?: Function
  zIndex?: number
}) => {
  useLayoutEffect(() => {
    if (!isOpen) return
    const node = document.querySelector('#root')
    if (node) {
      const overlayDiv = document.createElement('div')
      overlayDiv.style.background = 'rgba(0,0,0,0.1)'
      overlayDiv.style.position = 'absolute'
      overlayDiv.style.top = '0px'
      overlayDiv.style.right = '0px'
      overlayDiv.style.bottom = '0px'
      overlayDiv.style.left = '0px'
      overlayDiv.style.zIndex = `${zIndex}`
      overlayDiv.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (onClick) {
          onClick()
        }
      })
      node.parentNode.insertBefore(overlayDiv, node)
      return () => {
        node.parentNode.removeChild(overlayDiv)
      }
    }
  }, [isOpen])
}
