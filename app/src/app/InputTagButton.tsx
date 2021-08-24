import React from 'react'
import { useTheme } from 'snackui'

import { TagButton, TagButtonProps } from './views/TagButton'

// TODO these two are manually in sync, this...

export const InputTagButton = (props: TagButtonProps & { isActive?: boolean }) => {
  const theme = useTheme()
  return (
    <TagButton
      size="lg"
      closable
      subtleIcon
      color="#111"
      backgroundColor="#fff"
      hoverStyle={{
        backgroundColor: '#ffffffee',
      }}
      pressStyle={{
        backgroundColor: '#ffffff99',
      }}
      // shadowRadius={8}
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
