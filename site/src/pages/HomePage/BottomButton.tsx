import { Button, ButtonProps, Image } from '@o/ui'
import React from 'react'

export const BottomButton = ({
  src,
  href,
  ...props
}: ButtonProps & {
  src?: string
  href?: any
}) => {
  return (
    <Button
      coat="translucent"
      elementProps={{
        href,
        tagName: 'a',
        target: '_blank',
      }}
      userSelect="none"
      circular
      size={1.5}
      cursor="pointer"
      {...props}
    >
      {(!!src && <Image width={25} height={25} src={src} />) || props.children}
    </Button>
  )
}
