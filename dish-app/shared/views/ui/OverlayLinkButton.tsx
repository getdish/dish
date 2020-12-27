// debug
import React from 'react'
import { BlurView, HStack, Text } from 'snackui'

import { RoutesTable } from '../../state/router'
import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'

export function OverlayLinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>({ Icon, children, ...props }: LinkButtonProps<Name, Params> & { Icon: any }) {
  return (
    <BlurView borderRadius={20}>
      <LinkButton
        borderRadius={90}
        shadowColor="rgba(0,0,0,0.175)"
        shadowRadius={13}
        shadowOffset={{ width: 0, height: 3 }}
        overflow="hidden"
        pointerEvents="auto"
        hoverStyle={{
          transform: [{ scale: 1.05 }],
        }}
        {...props}
      >
        <HStack
          alignItems="center"
          backgroundColor="rgba(0,0,0,0.75)"
          paddingVertical={7}
          paddingHorizontal={11}
        >
          <Icon
            size={12}
            color="rgba(255,255,255,0.5)"
            style={{ marginRight: 6 }}
          />
          <Text color="#fff" fontSize={13} fontWeight="500" opacity={0.85}>
            {children}
          </Text>
        </HStack>
      </LinkButton>
    </BlurView>
  )
}
