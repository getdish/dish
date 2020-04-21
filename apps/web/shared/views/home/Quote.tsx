import React, { memo } from 'react'
import { Text, TextProps } from 'react-native'

import { HStack, VStack } from '../ui/Stacks'

export const Quote = memo(
  ({
    style,
    by,
    ...props
  }: TextProps & {
    by?: string
    children: any
  }) => {
    return (
      <HStack spacing={10}>
        <Text
          style={{
            fontSize: 40,
            color: '#ccc',
            marginTop: -10,
            marginBottom: 0,
          }}
        >
          “
        </Text>
        <VStack spacing={6} flex={1}>
          <Text style={[{ fontSize: 16, color: '#999' }, style]} {...props} />
          {!!by && (
            <Text
              style={[
                { fontWeight: 'bold', fontSize: 13, color: '#999' },
                style,
              ]}
            >
              {by}
            </Text>
          )}
        </VStack>
      </HStack>
    )
  }
)
