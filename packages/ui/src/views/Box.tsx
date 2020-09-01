import React from 'react'

import { extendStaticConfig } from '../helpers/extendStaticConfig'
import { StackProps, VStack } from './Stacks'

const defaultStyle: StackProps = {
  backgroundColor: '#fff',
  padding: 5,
  borderRadius: 12,
  shadowColor: 'rgba(0,0,0,0.1)',
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 3 },
  overflow: 'hidden',
}

export type BoxProps = StackProps

export function Box(props: BoxProps) {
  return <VStack {...defaultStyle} {...props} />
}

Box.staticConfig = extendStaticConfig(VStack, {
  defaultStyle,
})
