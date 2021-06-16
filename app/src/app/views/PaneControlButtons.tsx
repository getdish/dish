import React from 'react'
import { AbsoluteHStack, useMedia } from 'snackui'

export const PaneControlButtons = (props: { children: any }) => {
  const media = useMedia()
  return (
    <AbsoluteHStack
      className="pane-control-buttons"
      zIndex={10000000000}
      top={media.sm ? 6 : -6}
      right={media.sm ? 6 : -12}
      spacing
    >
      {props.children}
    </AbsoluteHStack>
  )
}

export const PaneControlButtonsLeft = (props: { children: any }) => {
  const media = useMedia()
  return (
    <AbsoluteHStack
      className="pane-control-buttons-left"
      zIndex={10000000000}
      top={media.sm ? 6 : 12}
      left={media.sm ? 6 : 12}
      spacing
    >
      {props.children}
    </AbsoluteHStack>
  )
}