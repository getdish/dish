import React from 'react'
import { Theme, useTheme } from 'snackui'

import { TagButton, TagButtonProps } from './views/TagButton'

// TODO these two are manually in sync, this...

export const InputTagButton = (props: TagButtonProps & { isActive?: boolean }) => {
  const theme = useTheme()
  return (
    // makes x visible in dark mode
    <Theme name="light">
      <TagButton
        size="sm"
        closable
        subtleIcon
        color="#222"
        backgroundColor="#fff"
        hoverStyle={{
          backgroundColor: '#ffffffee',
        }}
        pressStyle={{
          backgroundColor: '#ffffff99',
        }}
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
    </Theme>
  )
}
