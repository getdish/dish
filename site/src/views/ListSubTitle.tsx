import { SubTitle, TextProps } from '@o/ui'
import React from 'react'

export const ListSubTitle = (props: TextProps) => (
  // setting height here prevents flicker on mount of measuring in virtual list
  <SubTitle paddingTop={20} fontSize={20} height={28} {...props} />
)
