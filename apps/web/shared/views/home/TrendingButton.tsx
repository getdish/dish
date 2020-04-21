import React from 'react'
import { Text } from 'react-native'

import { RoutesTable } from '../../state/router'
import { Icon } from '../ui/Icon'
import { LinkButton, LinkButtonProps } from '../ui/Link'
import { HStack } from '../ui/Stacks'
import { flatButtonStyle } from './baseButtonStyle'

export const TrendingButton = <
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>({
  rank,
  children,
  ...rest
}: LinkButtonProps<Name, Params> & {
  rank?: number
}) => {
  return (
    <HStack alignItems="center">
      <LinkButton
        {...flatButtonStyle}
        backgroundColor="transparent"
        margin={2}
        flexDirection="row"
        alignItems="center"
        overflow="hidden"
        ellipse
        {...rest}
      >
        {rank ? <Text>`${rank}. `</Text> : null}
        <Icon
          marginTop={2}
          marginRight={4}
          marginLeft={-2}
          name="ChevronDown"
          size={14}
          color="red"
        />
        <Text style={{ fontWeight: '500', lineHeight: 17 }}>{children}</Text>
      </LinkButton>
    </HStack>
  )
}
