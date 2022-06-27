import { TagButton, TagButtonProps } from './views/TagButton'
import React from 'react'

// TODO these two are manually in sync, this...

export const InputTagButton = (props: TagButtonProps & { isActive?: boolean }) => {
  return (
    // makes x visible in dark mode
    <TagButton
      size="$3"
      closable
      subtleIcon
      elevation="$1"
      hideRating
      hideRank
      {...(props.isActive && {
        backgroundColor: '$background',
        hoverStyle: {
          backgroundColor: '$background',
        },
      })}
      {...props}
    />
  )
}
