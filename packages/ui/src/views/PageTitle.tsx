import React, { memo } from 'react'

import { StackProps, VStack } from './Stacks'
import { Text } from './Text'

export const PageTitle = memo(
  ({ children, subTitle, ...rest }: StackProps & { subTitle?: any }) => {
    return (
      <VStack maxWidth="100%" minHeight={68} justifyContent="center" {...rest}>
        <Text
          selectable
          numberOfLines={1}
          flex={1}
          maxWidth="80%"
          opacity={1}
          fontSize={22}
          lineHeight={32}
          fontWeight="600"
        >
          {children}
          {!!subTitle && (
            <>
              <br />
              <Text
                selectable
                numberOfLines={1}
                width="100%"
                color="#666"
                fontSize={22}
                fontWeight="200"
              >
                {subTitle}
              </Text>
            </>
          )}
        </Text>
        {/* <Divider alignSelf="flex-end" /> */}
      </VStack>
    )
  }
)
