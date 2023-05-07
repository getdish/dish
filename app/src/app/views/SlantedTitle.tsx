import { isStringChild } from '../../helpers/isStringChild'
import { H2, SizableTextProps, SlantedYStack, YStackProps } from '@dish/ui'
import React from 'react'

export type SlantedTitleProps = YStackProps &
  Partial<Pick<SizableTextProps, 'size' | 'color' | 'lineHeight' | 'fontSize' | 'fontWeight'>>

export const SlantedTitle = ({
  size,
  children,
  color = '$color',
  lineHeight,
  fontSize,
  fontWeight = '700',
  ...props
}: SlantedTitleProps) => {
  return (
    // @ts-ignore
    <SlantedYStack alignSelf="flex-start" size={size} {...props}>
      {isStringChild(children) ? (
        <H2
          size={size}
          {...{
            color,
            lineHeight,
            fontSize,
            fontWeight,
          }}
          textAlign="center"
        >
          {children}
        </H2>
      ) : (
        children
      )}
    </SlantedYStack>
  )
}
