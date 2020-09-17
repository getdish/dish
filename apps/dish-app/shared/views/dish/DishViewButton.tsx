import { HStack, Spacer, StackProps, Text } from '@dish/ui'
import React, { memo } from 'react'

import { flatButtonStyle } from '../baseButtonStyle'
import { LinkButton } from '../ui/LinkButton'
import { LinkButtonNamedProps } from '../ui/LinkProps'

export const DishViewButton = memo(
  ({
    name,
    icon,
    ...rest
  }: {
    name: LinkButtonNamedProps['name']
    icon: string
    size?: number
  } & StackProps) => {
    return (
      <LinkButton
        {...flatButtonStyle}
        paddingVertical={8}
        borderRadius={100}
        tag={{ type: 'dish', name }}
        {...rest}
      >
        <HStack>
          {!!icon && (
            <>
              <Text fontSize={16} marginVertical={-5}>
                {icon}
              </Text>
              <Spacer size="xs" />
            </>
          )}
          <Text fontSize={14} opacity={0.8}>
            {name}
          </Text>
        </HStack>
      </LinkButton>
    )
  }
)
