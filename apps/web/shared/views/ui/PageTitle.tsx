import React, { memo } from 'react'
import { Text } from 'react-native'

import { Divider } from './Divider'
import { StackBaseProps, VStack } from './Stacks'

export const PageTitle = memo(
  ({ children, subTitle, ...rest }: StackBaseProps & { subTitle?: any }) => {
    return (
      <VStack
        width="100%"
        minHeight={68}
        paddingVertical={12}
        alignItems="center"
        justifyContent="center"
        {...rest}
      >
        <Text
          numberOfLines={1}
          style={{
            maxWidth: '80%',
            textAlign: 'center',
            opacity: 1,
            fontSize: 22,
            lineHeight: 25,
            fontWeight: '300',
          }}
        >
          {children}
          {!!subTitle && (
            <Text
              numberOfLines={1}
              style={{
                display: 'block',
                textAlign: 'center',
                width: '100%',
                color: '#666',
                fontSize: 18,
              }}
            >
              {subTitle}
            </Text>
          )}
        </Text>
        {/* <Divider alignSelf="flex-end" /> */}
      </VStack>
    )
  }
)
