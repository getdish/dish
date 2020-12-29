import React from 'react'
import { Text, TextProps } from 'snackui'

export const TextStrong = (props: TextProps) => {
  return (
    // @ts-ignore
    <Text display="inline" wordWrap="break-word" fontWeight="500" {...props} />
  )
}
