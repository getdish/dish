import React, { memo } from 'react'
import { Text } from 'react-native'

import { Divider } from './Divider'
import { StackBaseProps, VStack } from './Stacks'

export const PageTitle = memo(({ children, ...rest }: StackBaseProps) => {
  return (
    <>
      <VStack width="100%" alignItems="center" paddingVertical={12} {...rest}>
        <Text
          style={{
            // textTransform: 'uppercase',
            // letterSpacing: 4,
            opacity: 1,
            fontSize: 18,
            fontWeight: '600',
            // letterSpacing: -0.111,
            paddingBottom: 10,
          }}
        >
          {children}
        </Text>
        <Divider />
      </VStack>
    </>
  )
})
