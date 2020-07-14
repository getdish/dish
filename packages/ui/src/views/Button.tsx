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
  backgroundColor: 'rgba(150,150,150,0.05)',
  hoverStyle: {
    backgroundColor: 'rgba(150,150,150,0.08)',
  },
  pressStyle: {
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
}

Button.staticConfig = extendStaticConfig(HStack, {
  defaultStyle,
})
