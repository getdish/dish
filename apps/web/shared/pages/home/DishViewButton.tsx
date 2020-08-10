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
            <Text fontSize={16} marginVertical={-5}>
              {icon}
            </Text>
            <Spacer size="xs" />
          </>
        )}
        <Text fontSize={14} opacity={0.8}>
          {name}
        </Text>
      </LinkButton>
    )
  }
)
