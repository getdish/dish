import { Text, TextProps } from '@dish/ui'
import React from 'react'

export function TextSuperScript(props: TextProps) {
  return <Text fontSize={12} textAlignVertical="top" opacity={0.5} {...props} />
}
