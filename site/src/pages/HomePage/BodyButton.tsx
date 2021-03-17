import { Button, ButtonProps } from '@o/ui'
import React from 'react'

export const BodyButton = (props: ButtonProps) => (
  <Button
    sizePadding={1.6}
    sizeRadius={2}
    cursor="pointer"
    tagName="a"
    textDecoration="none"
    borderWidth={0}
    {...props}
  />
)
