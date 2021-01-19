import React, { useState } from 'react'
import { Input, InputProps } from 'snackui'

// only works for mulitline
export function ExpandingInput(props: InputProps) {
  const [size, setSize] = useState({
    width: 'auto' as any,
    height: 'auto' as any,
  })
  return (
    <Input
      width={size.width}
      height={size.height}
      {...props}
      onContentSizeChange={(e) => {
        console.log({
          width: e.nativeEvent.contentSize.width,
          height: e.nativeEvent.contentSize.height,
        })
        setSize({
          width: e.nativeEvent.contentSize.width,
          height: e.nativeEvent.contentSize.height,
        })
      }}
    />
  )
}
