import React from 'react'
import { ChevronDown } from 'react-feather'
import { Text } from 'react-native'

import { RoutesTable } from '../../state/router'
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
        flexDirection="row"
        alignItems="center"
        overflow="hidden"
        ellipse
        {...rest}
      >
        {rank ? <Text>`${rank}. `</Text> : null}
        <ChevronDown
          size={14}
          style={{
            marginTop: 2,
            marginRight: 4,
            marginLeft: -2,
            color: 'red',
          }}
        />
        <Text style={{ fontWeight: '400', lineHeight: 17 }}>{children}</Text>
      </LinkButton>
    </HStack>
  )
}
