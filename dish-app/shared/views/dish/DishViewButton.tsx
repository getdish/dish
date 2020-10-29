import React, { memo } from 'react'
import { HStack, Spacer, StackProps, Text } from 'snackui'

import { getColorsForName } from '../../helpers/getColorsForName'
import { Link } from '../ui/Link'
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
    const { lightColor, color } = getColorsForName(name)
    return (
      <Link tag={{ type: 'dish', name }}>
        <HStack
          borderWidth={1}
          paddingVertical={6}
          paddingHorizontal={12}
          alignItems="center"
          borderRadius={4}
          borderColor={`${color}22`}
          borderBottomWidth={2}
          // backgroundColor={lightColor}
          hoverStyle={{
            backgroundColor: `${lightColor}cc`,
          }}
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
        </HStack>
      </Link>
    )
  }
)
