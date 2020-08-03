import { Spacer, StackProps, Text } from '@dish/ui'
import React, { memo } from 'react'

import { LinkButton } from '../../views/ui/LinkButton'
import { flatButtonStyle } from './baseButtonStyle'

export const DishViewButton = memo(
  ({
    name,
    icon,
    ...rest
  }: {
    name: string
    icon: string
    size?: number
  } & StackProps) => {
    return (
      <LinkButton {...flatButtonStyle} tag={{ type: 'dish', name }} {...rest}>
        {!!icon && (
          <>
            <Text fontSize={22} marginVertical={-5}>
              {icon}
            </Text>
            <Spacer />
          </>
        )}
        <Text fontSize={14} opacity={0.9}>
          {name}
        </Text>
      </LinkButton>
    )
  }
)
