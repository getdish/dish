import { Image, Space, TextProps } from '@o/ui'
import React from 'react'

import markSolid from '../public/images/mark-solid.svg'
import { LogoCircle } from './DishLogo'
import { Text } from './Text'

export const IntroText = (props: TextProps) => {
  return (
    <Text size={1.45} sizeLineHeight={1.35} fontWeight={400} width="100%">
      {wordsWithBrandMark(props.children)}
    </Text>
  )
}

export const wordsWithBrandMark = (text: any) => {
  const words = `${text}`.split(' ')
  const allButLast = words.slice(0, words.length - 1).join(' ')
  const last = words[words.length - 1]
  return [
    allButLast,
    <span style={{ display: 'inline-block' }}>
      {last}
      <span style={{ marginLeft: 5 }}>
        <LogoCircle scale={0.65} />
      </span>
    </span>,
  ] as const
}

export const BrandMarkInline = () => (
  <Image
    src={markSolid}
    display="inline"
    width={16}
    height={16}
    transform={{
      y: -2,
    }}
    margin={[-2, 8]}
    userSelect="none"
  />
)
