import { AbsoluteXStack, useMedia } from '@dish/ui'
import React from 'react'

export const PaneControlButtons = (props: { children: any }) => {
  const media = useMedia()
  return (
    <AbsoluteXStack
      className="pane-control-buttons"
      zIndex={10000000000}
      top={media.sm ? -8 : -12}
      right={media.sm ? -8 : -14}
      spacing
    >
      {props.children}
    </AbsoluteXStack>
  )
}

export const PaneControlButtonsLeft = (props: { children: any }) => {
  const media = useMedia()
  return (
    <AbsoluteXStack
      className="pane-control-buttons-left"
      zIndex={10000000000}
      top={media.sm ? 6 : 12}
      left={media.sm ? 6 : 12}
      space="$2"
      alignItems="center"
    >
      {props.children}
    </AbsoluteXStack>
  )
}
