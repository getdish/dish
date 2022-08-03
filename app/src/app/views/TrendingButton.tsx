import { DRouteName } from '../../router'
import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'
import { RoutesTable } from '@dish/router'
import { Text, XStack } from '@dish/ui'
import { ChevronDown, ChevronUp } from '@tamagui/feather-icons'
import React from 'react'

export const TrendingButton = <
  Name extends DRouteName = DRouteName,
  Params = RoutesTable[Name]['params']
>({
  rank,
  children,
  ...rest
}: LinkButtonProps<Name, Params> & {
  rank?: number
}) => {
  return (
    <XStack alignItems="center">
      {/* @ts-ignore */}
      <LinkButton
        backgroundColor="transparent"
        flexDirection="row"
        alignItems="center"
        overflow="hidden"
        {...rest}
      >
        {rank ? <Text>`${rank}. `</Text> : null}
        <TrendingIcon direction="up" />
        <Text fontWeight="400" lineHeight={17}>
          {children}
        </Text>
      </LinkButton>
    </XStack>
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
