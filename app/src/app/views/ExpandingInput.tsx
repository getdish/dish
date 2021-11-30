import { Input } from '@dish/ui'
import React, { useState } from 'react'

// only works for mulitline
export function ExpandingInput(props: any) {
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
