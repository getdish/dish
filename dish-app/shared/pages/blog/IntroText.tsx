import { Paragraph, ParagraphProps } from '@dish/ui'
import React from 'react'
import { Image } from 'react-native'

import markSolid from './mark-solid.svg'

export const IntroText = (props: ParagraphProps) => {
  if (props.children.startsWith('When you first hear of Dish')) {
    debugger
  }
  return (
    <Paragraph size="xxl" width="100%">
      {wordsWithBrandMark(props.children)}
    </Paragraph>
  )
}

export const wordsWithBrandMark = (text: any) => {
  const words = `${text}`.split(' ')
  const allButLast = words.slice(0, words.length - 1).join(' ')
  const last = words[words.length - 1]
  return (
    <>
      {allButLast}{' '}
      <span style={{ display: 'inline-block' }}>
        {last}
        <BrandMarkInline />
      </span>
    </>
  )
}

export const BrandMarkInline = () => (
  <Image
    source={{ uri: markSolid }}
    style={{
      display: 'inline-block' as any,
      width: 16,
      height: 16,
      transform: [
        {
          translateY: -2,
        },
      ],
      marginVertical: -2,
      marginHorizontal: 8,
    }}
  />
)
