import { PaneControlButtons } from './PaneControlButtons'
import { StackViewCloseButton } from './StackViewCloseButton'
import React from 'react'

export const StackCloseButton = (props: { onClose?: () => void }) => {
  return (
    <PaneControlButtons>
      <StackViewCloseButton onPressOut={props.onClose} />
    </PaneControlButtons>
  )
}
