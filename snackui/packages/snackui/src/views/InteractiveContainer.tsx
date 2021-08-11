import React from 'react'

import { useTheme } from '../hooks/useTheme'
import { StackProps } from '../StackProps'
import { HStack } from './Stacks'

export const InteractiveContainer = (props: StackProps) => {
  const theme = useTheme()
  return (
    <HStack
      borderRadius={100}
      borderWidth={1}
      borderColor={theme.borderColor}
      hoverStyle={{
        borderColor: theme.borderColorHover,
      }}
      overflow="hidden"
      {...props}
    />
  )
}
