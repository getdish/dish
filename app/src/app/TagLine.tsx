import React from 'react'
import { Paragraph, useTheme } from 'snackui'

export const TagLine = (props: { scale?: number }) => {
  const theme = useTheme()
  return (
    <Paragraph
      fontWeight="300"
      minWidth={280}
      size="xl"
      textAlign="center"
      position="relative"
      color={theme.color}
      zIndex={1000}
      scale={props.scale ?? 1}
    >
      pocket guide to the world
    </Paragraph>
  )
}
