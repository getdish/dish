import { HStack, Text } from '@dish/ui'
import React from 'react'

import { RoutesTable } from '../../state/router'
import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'

export function OverlayLinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>({ Icon, children, ...props }: LinkButtonProps<Name, Params> & { Icon: any }) {
  return (
    <LinkButton
      backgroundColor="rgba(0,0,0,0.65)"
      paddingVertical={7}
      paddingHorizontal={11}
      borderRadius={90}
      shadowColor="rgba(0,0,0,0.175)"
      shadowRadius={13}
      shadowOffset={{ width: 0, height: 3 }}
      overflow="hidden"
      hoverStyle={{
        transform: [{ scale: 1.05 }],
      }}
      {...props}
    >
      <HStack alignItems="center">
        <Icon
          size={12}
          color="rgba(255,255,255,0.5)"
          style={{ marginRight: 6 }}
        />
        <Text color="#fff" fontSize={12} fontWeight="500" opacity={0.85}>
          {children}
        </Text>
      </HStack>
    </LinkButton>
  )
}
