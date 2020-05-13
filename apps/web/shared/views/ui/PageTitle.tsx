import React, { memo } from 'react'
import { Text } from 'react-native'

import { StackProps, VStack } from './Stacks'
import { SelectableText } from './Text'

export const PageTitle = memo(
  ({ children, subTitle, ...rest }: StackProps & { subTitle?: any }) => {
    return (
      <VStack
        maxWidth="100%"
        minHeight={68}
        paddingBottom={4}
        justifyContent="center"
        // paddingBottom={28}
        // alignItems="center"
        // justifyContent="center"
        {...rest}
      >
        <SelectableText
          numberOfLines={1}
          style={{
            maxWidth: '80%',
            // textAlign: 'center',
            opacity: 1,
            fontSize: 22,
            // fontFamily: 'Helvetica',
            lineHeight: 30,
            fontWeight: '500',
          }}
        >
          {children}
          {!!subTitle && (
            <SelectableText
              numberOfLines={1}
              style={
                {
                  display: 'block',
                  // textAlign: 'center',
                  width: '100%',
                  color: '#666',
                  fontSize: 20,
                  fontWeight: '300',
                } as any
              }
            >
              {subTitle}
            </SelectableText>
          )}
        </SelectableText>
        {/* <Divider alignSelf="flex-end" /> */}
      </VStack>
    )
  }
)
