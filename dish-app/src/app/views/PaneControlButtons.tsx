import React from 'react'
import { AbsoluteVStack, useMedia } from 'snackui'

export const PaneControlButtons = (props: { children: any }) => {
  const media = useMedia()
  return (
    <AbsoluteVStack
      className="pane-control-buttons"
      zIndex={10000000000}
      right={media.sm ? 6 : -12}
      top={media.sm ? 6 : -6}
      debug
    >
      {props.children}
    </AbsoluteVStack>
  )
}
