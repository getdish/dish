import { Text, TextProps } from '@dish/ui'
import React from 'react'

export const TextStrong = (props: TextProps) => {
  // @ts-ignore
  return <Text display="inline" fontWeight="500" {...props} />
}
