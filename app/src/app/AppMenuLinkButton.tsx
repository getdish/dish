import { Text, Tooltip, XStack } from '@dish/ui'
import React, { forwardRef, memo } from 'react'

import { useSearchBarTheme } from './hooks/useSearchBarTheme'
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
      const { color } = useSearchBarTheme()
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
          pressStyle={{
            opacity: 1,
          }}
          hoverStyle={{
            opacity: 1,
          }}
          {...props}
        >
          {(isActive) => {
            const IconElement = isActive ? ActiveIcon ?? Icon : Icon
            return (
              <XStack space alignItems="center" justifyContent="center">
                <IconElement color={color} size={22} />
                {!!text && (
                  <Text color={color} fontSize={13} fontWeight="500">
                    {text}
                  </Text>
                )}
              </XStack>
            )
          }}
        </LinkButtonAutoActive>
      )
    }
  )
)
