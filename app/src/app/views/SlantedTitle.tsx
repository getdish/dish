import { BoxProps, SizableTextProps, Title } from '@dish/ui'
import React from 'react'

import { isStringChild } from '../../helpers/isStringChild'
import { SlantedBox } from './SlantedBox'
import { TitleStyled } from './TitleStyled'

export type SlantedTitleProps = Omit<BoxProps, 'color'> &
  Partial<Pick<SizableTextProps, 'size' | 'color' | 'lineHeight' | 'fontSize' | 'fontWeight'>>

export const SlantedTitle = ({ size, children, ...props }: SlantedTitleProps) => {
  // const [{ children, ...rest }, textStyle] = useTextProps(props as any, true)

  return (
    <SlantedBox alignSelf="flex-start" {...props}>
      {isStringChild(children) ? (
        <TitleStyled
          fontWeight="800"
          size={size}
          textAlign="center"
          // {...textStyle}
        >
          {children}
        </TitleStyled>
      ) : (
        children
      )}
    </SlantedBox>
  )
}
