import { YStack, YStackProps } from '@dish/ui'
import React from 'react'

export const ContentSectionHoverable = (props: YStackProps) => {
  return (
    <YStack
      position="relative"
      width="100%"
      hoverStyle={{
        backgroundColor: 'rgba(150,150,150,0.05)',
      }}
      {...props}
    />
  )
}
