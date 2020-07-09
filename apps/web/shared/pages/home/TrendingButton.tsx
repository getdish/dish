import { HStack, Text } from '@dish/ui'
import React from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'

import { RoutesTable } from '../../state/router'
import { LinkButton } from '../../views/ui/LinkButton'
import { LinkButtonProps } from '../../views/ui/LinkProps'
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
        <TrendingIcon direction="up" />
        <Text style={{ fontWeight: '400', lineHeight: 17 }}>{children}</Text>
      </LinkButton>
    </HStack>
  )
}

export function TrendingIcon(props: { direction: 'up' | 'down' }) {
  const Element = props.direction === 'up' ? ChevronUp : ChevronDown
  return (
    <Element
      size={14}
      style={{
        marginTop: 2,
        marginRight: 4,
        marginLeft: -2,
        color: props.direction === 'up' ? 'green' : 'red',
      }}
    />
  )
}
