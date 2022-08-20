import { LinkButtonAutoActive } from './views/LinkButtonAutoActive'
import { LinkButtonProps } from './views/LinkProps'
import React, { forwardRef, memo } from 'react'

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
          backgroundColor="transparent"
          opacity={0.6}
          alignSelf="stretch"
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
