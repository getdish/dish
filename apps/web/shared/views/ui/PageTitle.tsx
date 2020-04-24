import React, { memo } from 'react'
import { Text } from 'react-native'

import { StackProps, VStack } from './Stacks'

export const PageTitle = memo(
  ({ children, subTitle, ...rest }: StackProps & { subTitle?: any }) => {
    return (
      <VStack
        width="100%"
        minHeight={68}
        paddingVertical={12}
        paddingBottom={24}
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
            fontSize: 24,
            lineHeight: 32,
            fontWeight: '300',
          }}
        >
          {children}
          {!!subTitle && (
            <Text
              numberOfLines={1}
              style={
                {
                  display: 'block',
                  textAlign: 'center',
                  width: '100%',
                  color: '#777',
                  fontSize: 15,
                  fontWeight: '400',
                } as any
              }
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
