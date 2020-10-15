import { Spacer, StackProps, Text } from '@dish/ui'
import React, { memo } from 'react'
import { StyleSheet } from 'react-native'

import { flatButtonStyle } from '../baseButtonStyle'
import { LinkButton } from '../ui/LinkButton'
import { LinkButtonNamedProps } from '../ui/LinkProps'
import { getDishColors } from './getDishBackgroundColor'

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
    const { lightColor, color } = getDishColors(name)
    return (
      <LinkButton
        style={dishButtonStyles.base}
        borderColor={`${color}33`}
        backgroundColor={lightColor}
        hoverStyle={{
          backgroundColor: `${lightColor}cc`,
        }}
        tag={{ type: 'dish', name }}
        {...rest}
      >
        {!!icon && (
          <>
            <Text fontSize={16} marginVertical={-6}>
              {icon}
            </Text>
            <Spacer size="sm" />
          </>
        )}
        <Text color="rgba(0,0,0,0.75)" fontSize={15} opacity={0.8}>
          {name}
        </Text>
      </LinkButton>
    )
  }
)

const dishButtonStyles = StyleSheet.create({
  base: {
    ...flatButtonStyle,
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
})
