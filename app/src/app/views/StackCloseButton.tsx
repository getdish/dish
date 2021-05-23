import React from 'react'

import { PaneControlButtons } from './PaneControlButtons'
import { StackViewCloseButton } from './StackViewCloseButton'

export const StackCloseButton = () => {
  return (
    <PaneControlButtons>
      <StackViewCloseButton />
    </PaneControlButtons>
  )
}
