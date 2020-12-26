import React from 'react'
import { AbsoluteVStack, useMedia } from 'snackui'

export const PaneControlButtons = (props: { children: any }) => {
  const media = useMedia()
  return (
    <AbsoluteVStack
      zIndex={1000000000000}
      right={media.sm ? 40 : -12}
      top={media.sm ? 10 : -6}
    >
      {props.children}
    </AbsoluteVStack>
  )
}
