import React, { memo } from 'react'

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
            flex: 1,
            maxWidth: '80%',
            opacity: 1,
            fontSize: 22,
            lineHeight: 30,
            fontWeight: '700',
          }}
        >
          {children}
          {!!subTitle && (
            <>
              <br />
              <SelectableText
                numberOfLines={1}
                style={{
                  width: '100%',
                  color: '#666',
                  fontSize: 22,
                  fontWeight: '200',
                }}
              >
                {subTitle}
              </SelectableText>
            </>
          )}
        </SelectableText>
        {/* <Divider alignSelf="flex-end" /> */}
      </VStack>
    )
  }
)
