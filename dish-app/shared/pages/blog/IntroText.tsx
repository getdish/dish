import React from 'react'
import { Image } from 'react-native'
import { Paragraph, ParagraphProps } from 'snackui'

import markSolid from '../../../shared/assets/d.svg'

export const IntroText = (props: ParagraphProps) => {
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
      width: 22,
      height: 22,
      transform: [
        {
          translateY: -2,
        },
      ],
      marginVertical: -4,
      marginHorizontal: 8,
    }}
  />
)
