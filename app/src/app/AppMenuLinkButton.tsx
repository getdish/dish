import React, { memo } from 'react'
import { HStack, Text, Tooltip } from 'snackui'

import { useSearchBarTheme } from './hooks/useSearchBarTheme'
import { LinkButtonAutoActive } from './views/LinkButtonAutoActive'
import { LinkButtonProps } from './views/LinkProps'

export const AppMenuLinkButton = memo(
  ({
    Icon,
    ActiveIcon,
    text,
    tooltip,
    ...props
  }: LinkButtonProps & {
    Icon: any
    ActiveIcon?: any
    text?: any
    tooltip?: string
  }) => {
    const { color } = useSearchBarTheme()

    const linkButtonElement = (
      <LinkButtonAutoActive
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
            <HStack spacing alignItems="center" justifyContent="center">
              <IconElement color={color} size={22} />
              {!!text && (
                <Text color={color} fontSize={13} fontWeight="500">
                  {text}
                </Text>
              )}
            </HStack>
          )
        }}
      </LinkButtonAutoActive>
    )

    if (!!tooltip) {
      return <Tooltip contents={tooltip}>{linkButtonElement}</Tooltip>
    }

    return linkButtonElement
  }
)