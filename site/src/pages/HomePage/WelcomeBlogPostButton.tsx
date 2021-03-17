import { Tag } from '@o/ui'
import React from 'react'

import { linkProps } from '../../useLink'

export function WelcomeBlogPostButton() {
  return (
    <Tag
      sm-display="none"
      size={0.85}
      sizeHeight={1.01}
      sizePadding={1.4}
      sizeRadius={4}
      coat="lightBlue"
      zIndex={1000}
      position="absolute"
      top={-60}
      right={-10}
      borderWidth={2}
      hoverStyle
      iconAfter
      icon="chevron-right"
      // safari ellipse bugfix...
      minWidth={205}
      {...linkProps('/blog/update-two')}
    >
      Orbit enters private beta!
    </Tag>
  )
}
