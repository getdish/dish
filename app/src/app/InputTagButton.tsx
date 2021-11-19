import { Theme, useTheme } from '@dish/ui'
import React from 'react'

import { TagButton, TagButtonProps } from './views/TagButton'

// TODO these two are manually in sync, this...

export const InputTagButton = (props: TagButtonProps & { isActive?: boolean }) => {
  const theme = useTheme()
  return (
    // makes x visible in dark mode
    <TagButton
      size="sm"
      closable
      subtleIcon
      elevation={1}
      hideRating
      hideRank
      {...(props.isActive && {
        backgroundColor: theme.backgroundColor,
        hoverStyle: {
          backgroundColor: theme.backgroundColor,
        },
      })}
      {...props}
    />
  )
}
