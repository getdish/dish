import { AbsoluteVStack, StackProps } from '@dish/ui'
import React, { memo } from 'react'

import { omStatic } from '../state/omStatic'
import { CloseButton } from './ui/CloseButton'

export const StackViewCloseButton = memo((props: StackProps) => {
  return (
    <AbsoluteVStack
      className="cursor-pointer"
      pointerEvents="auto"
      zIndex={100000000000}
      {...props}
    >
      <CloseButton
        padding={5}
        borderRadius={20}
        shadowColor="rgba(0,0,0,0.25)"
        shadowRadius={10}
        shadowOffset={{ width: 0, height: 2 }}
        onPressOut={() => omStatic.actions.home.up()}
        size={16}
      />
    </AbsoluteVStack>
  )
})
