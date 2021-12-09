import { Paragraph } from '@dish/ui'
import React from 'react'

export const TagLine = (props: { scale?: number }) => {
  return (
    <Paragraph
      fontWeight="400"
      minWidth={280}
      size="$5"
      textAlign="center"
      position="relative"
      zIndex={1000}
      scale={props.scale ?? 1}
    >
      pocket guide to the world
    </Paragraph>
  )
}
