import React from 'react'
import { Paragraph } from 'snackui'

export const TagLine = (props: { scale?: number }) => {
  return (
    <Paragraph
      fontWeight="300"
      minWidth={280}
      size="xl"
      textAlign="center"
      position="relative"
      zIndex={1000}
      scale={props.scale ?? 1}
    >
      pocket guide to the world
    </Paragraph>
  )
}
