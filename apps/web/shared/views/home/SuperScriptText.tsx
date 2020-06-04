import { Text, TextProps } from '@dish/ui'
import React from 'react'

export function SuperScriptText(props: TextProps) {
  return <Text fontSize={12} textAlignVertical="top" opacity={0.5} {...props} />
}

SuperScriptText.staticConfig = Text.staticConfig
