import { Text, TextProps } from '@dish/ui'
import React from 'react'

export function SuperScriptText({ style, ...rest }: TextProps) {
  return <Text fontSize={12} textAlignVertical="top" opacity={0.5} {...rest} />
}
