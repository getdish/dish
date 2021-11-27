import { BoxProps, H2, SizableTextProps, SlantedBox } from '@dish/ui'
import React from 'react'

import { isStringChild } from '../../helpers/isStringChild'

export type SlantedTitleProps = Omit<BoxProps, 'color'> &
  Partial<Pick<SizableTextProps, 'size' | 'color' | 'lineHeight' | 'fontSize' | 'fontWeight'>>

export const SlantedTitle = ({ size, children, ...props }: SlantedTitleProps) => {
  // const [{ children, ...rest }, textStyle] = useTextProps(props as any, true)

  return (
    <SlantedBox alignSelf="flex-start" {...props}>
      {isStringChild(children) ? (
        <H2
          fontWeight="800"
          size={size}
          textAlign="center"
          // {...textStyle}
        >
          {children}
        </H2>
      ) : (
        children
      )}
    </SlantedBox>
  )
}
