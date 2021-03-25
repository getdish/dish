import { View } from '@o/ui'
import React from 'react'

import { contentSpace, contentSpaceLg, contentSpaceSm } from './contentSpaceSm'
import { TitleText } from './TitleText'

export const H1 = (props) => (
  <>
    <TitleText tagName="h1" size="lg" {...props} />
    {contentSpace}
  </>
)

export const H2 = (props) => (
  <View>
    {contentSpaceLg}
    <TitleText tagName="h2" fontWeight={400} size="sm" {...props} />
    {contentSpace}
  </View>
)

export const H3 = (props) => (
  <View>
    {contentSpace}
    <TitleText tagName="h3" size="xxxs" {...props} />
    {contentSpace}
  </View>
)

export const H4 = (props) => (
  <View>
    {contentSpaceSm}
    <TitleText tagName="h4" size="xxxs" fontWeight={400} alpha={0.7} {...props} />
    {contentSpace}
  </View>
)

export const H5 = (props) => (
  <View>
    {contentSpaceSm}
    <TitleText tagName="h5" size="xxxxs" fontWeight={400} alpha={0.6} {...props} />
    {contentSpaceSm}
  </View>
)
