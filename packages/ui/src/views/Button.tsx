// debug
import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { HStack, StackProps } from './Stacks'

export type ButtonProps = StackProps

// TODO colors, spacing, static extract + colors/spacing
// TODO sizing, static + sizing

export const Button = (props: ButtonProps) => {
  return <HStack {...defaultStyle} {...props} />
}

const defaultStyle: ButtonProps = {
  paddingHorizontal: 5,
  paddingVertical: 4,
  borderRadius: 5,
  backgroundColor: 'blue',
  hoverStyle: {
    backgroundColor: 'lightblue',
  },
  pressStyle: {
    backgroundColor: 'darkblue',
  },
}

Button.staticConfig = extendStaticConfig(HStack, {
  defaultStyle,
})
