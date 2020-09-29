import { Spacer, StackProps, Text } from '@dish/ui'
import React, { memo } from 'react'

import { flatButtonStyle } from '../baseButtonStyle'
import { LinkButton } from '../ui/LinkButton'
import { LinkButtonNamedProps } from '../ui/LinkProps'
import { getDishBackgroundColor } from './getDishBackgroundColor'

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
    const backgroundColor = getDishBackgroundColor(name)
    return (
      <LinkButton
        {...flatButtonStyle}
        backgroundColor={backgroundColor}
        hoverStyle={{
          backgroundColor: `${backgroundColor}cc`,
        }}
        paddingVertical={8}
        paddingHorizontal={12}
        alignItems="center"
        borderRadius={100}
        tag={{ type: 'dish', name }}
        {...rest}
      >
        {!!icon && (
          <>
            <Text fontSize={16} marginVertical={-2}>
              {icon}
            </Text>
            <Spacer size="xs" />
          </>
        )}
        <Text color="rgba(0,0,0,0.75)" fontSize={14} opacity={0.8}>
          {name}
        </Text>
      </LinkButton>
    )
  }
)
