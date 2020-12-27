import React from 'react'
import { AbsoluteVStack, useMedia } from 'snackui'

export const PaneControlButtons = (props: { children: any }) => {
  const media = useMedia()
  return (
    <AbsoluteVStack
      zIndex={1000000000000}
      right={media.sm ? 0 : -12}
      top={media.sm ? 0 : -6}
    >
      {props.children}
    </AbsoluteVStack>
  )
}
