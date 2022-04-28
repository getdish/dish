import { Paragraph, ParagraphProps, Theme, useTheme } from '@dish/ui'
import React from 'react'

export const HighlightedText = (props: ParagraphProps) => {
  return (
    <Paragraph
      theme="orange"
      borderWidth={1}
      backgroundColor="$background"
      borderColor="$borderColor"
      borderRadius={10}
      paddingVertical="2%"
      paddingHorizontal="3%"
      {...props}
    />
  )
}
