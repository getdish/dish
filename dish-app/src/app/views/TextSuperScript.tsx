import React from 'react'
import { Text, TextProps } from 'snackui'

export function TextSuperScript(props: TextProps) {
  return <Text fontSize={12} textAlignVertical="top" opacity={0.5} {...props} />
}
