import React from 'react'
import { Paragraph, useTheme } from 'snackui'

export const TagLine = () => {
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
    >
      pocket guide to the world
    </Paragraph>
  )
}
