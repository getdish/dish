import { HStack, Text } from '@dish/ui'
import React from 'react'

import { RoutesTable } from '../../state/router'
import { BlurView } from '../BlurView'
import { LinkButton } from './LinkButton'
import { LinkButtonProps } from './LinkProps'

export function OverlayLinkButton<
  Name extends keyof RoutesTable = keyof RoutesTable,
  Params = RoutesTable[Name]['params']
>({ Icon, children, ...props }: LinkButtonProps<Name, Params> & { Icon: any }) {
  return (
    <LinkButton
      borderRadius={90}
      shadowColor="rgba(0,0,0,0.175)"
      shadowRadius={13}
      shadowOffset={{ width: 0, height: 3 }}
      marginBottom={10}
      overflow="hidden"
      pointerEvents="auto"
      noText
      hoverStyle={{
        transform: [{ scale: 1.05 }],
      }}
      {...props}
    >
      <BlurView borderRadius={20}>
        <HStack
          alignItems="center"
          backgroundColor="rgba(0,0,0,0.65)"
          paddingVertical={7}
          paddingHorizontal={11}
        >
          <Icon
            size={12}
            color="rgba(255,255,255,0.5)"
            style={{ marginRight: 6 }}
          />
          <Text color="#fff" fontSize={12} fontWeight="400" opacity={0.85}>
            {children}
          </Text>
        </HStack>
      </BlurView>
    </LinkButton>
  )
}
