import React, { forwardRef, memo } from 'react'

import { LinkButtonAutoActive } from './views/LinkButtonAutoActive'
import { LinkButtonProps } from './views/LinkProps'

export const AppMenuLinkButton = memo(
  forwardRef(
    (
      {
        Icon,
        ActiveIcon,
        text,
        tooltip,
        ...props
      }: LinkButtonProps & {
        Icon: any
        ActiveIcon?: any
        text?: any
      },
      ref
    ) => {
      return (
        <LinkButtonAutoActive
          ref={ref}
          {...props}
          className="ease-in-out-faster"
          padding={12}
          backgroundColor="transparent"
          opacity={0.6}
          alignSelf="stretch"
          width="100%"
          icon={Icon}
          iconActive={ActiveIcon}
          pressStyle={{
            opacity: 1,
          }}
          hoverStyle={{
            opacity: 1,
          }}
          {...props}
        />
      )
    }
  )
)
