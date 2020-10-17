import { ChevronDown, ChevronUp } from '@dish/react-feather'
import React from 'react'
import { HStack, Text } from 'snackui'

import { RoutesTable } from '../../state/router'
import { flatButtonStyle } from '../baseButtonStyle'
import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'

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
