import { View } from '@o/ui'
import * as React from 'react'

import { mediaStyles } from '../constants'

export const MediaSmallHidden = (props) => (
  <View className="MediaSmallHidden" {...mediaStyles.visibleWhen.abovesm} {...props} />
)

export const MediaSmall = (props) => (
  <View className="MediaSmall" {...mediaStyles.hiddenWhen.abovesm} {...props} />
)
