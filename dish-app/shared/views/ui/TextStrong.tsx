import { Text, TextProps } from '@dish/ui'
import React from 'react'

export const TextStrong = (props: TextProps) => {
  return (
    // @ts-ignore
    <Text display="inline" wordWrap="break-word" fontWeight="500" {...props} />
  )
}
