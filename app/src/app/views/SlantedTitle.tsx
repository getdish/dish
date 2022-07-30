import { isStringChild } from '../../helpers/isStringChild'
import { H2, SizableTextProps, SlantedYStack, YStackProps } from '@dish/ui'
import React from 'react'

export type SlantedTitleProps = YStackProps &
  Partial<Pick<SizableTextProps, 'size' | 'color' | 'lineHeight' | 'fontSize' | 'fontWeight'>>

export const SlantedTitle = ({ size, children, ...props }: SlantedTitleProps) => {
  return (
    <SlantedYStack alignSelf="flex-start" size={size} {...props}>
      {isStringChild(children) ? (
        <H2 fontWeight="700" size={size} textAlign="center">
          {children}
        </H2>
      ) : (
        children
      )}
    </SlantedYStack>
  )
}
