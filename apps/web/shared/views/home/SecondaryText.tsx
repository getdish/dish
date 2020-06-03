import { Text, TextProps } from '@dish/ui'
import React from 'react'

export const SecondaryText = (props: TextProps) => {
  return <Text color="#777" fontSize={13} {...props} />
}

SecondaryText.staticConfig = Text.staticConfig
