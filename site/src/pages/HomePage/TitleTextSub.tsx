import { TitleProps, View } from '@o/ui'
import React, { forwardRef } from 'react'

import { fontProps } from '../../constants'
import { TitleText } from '../../views/TitleText'

export const TitleTextSub = ({ nodeRef, ...props }: TitleProps) => (
  <View nodeRef={nodeRef} maxWidth={800} minWidth={300} textAlign="center">
    <TitleText
      sizeFont={1.1}
      sizeLineHeight={1.25}
      fontWeight={400}
      alpha={0.55}
      letterSpacing={-0.5}
      {...fontProps.BodyFont}
      {...props}
    />
  </View>
)
