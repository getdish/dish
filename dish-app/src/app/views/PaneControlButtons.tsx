import React from 'react'
import { AbsoluteVStack, useMedia } from 'snackui'

export const PaneControlButtons = (props: { children: any }) => {
  const media = useMedia()
  return (
    <AbsoluteVStack
      className="pane-control-buttons"
      zIndex={10000000000}
      top={media.sm ? 6 : -6}
      right={media.sm ? 6 : -12}
      spacing
    >
      {props.children}
    </AbsoluteVStack>
  )
}

export const PaneControlButtonsLeft = (props: { children: any }) => {
  const media = useMedia()
  return (
    <AbsoluteVStack
      className="pane-control-buttons-left"
      zIndex={10000000000}
      top={media.sm ? 6 : -6}
      left={media.sm ? 6 : -12}
      spacing
    >
      {props.children}
    </AbsoluteVStack>
  )
}
