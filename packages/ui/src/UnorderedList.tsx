import React from 'react'
import { Paragraph, SizableTextProps, StackProps, Text, XStack, YStack } from 'tamagui'

export const UnorderedList = (props: StackProps) => {
  return <YStack paddingLeft="$4" {...props} />
}

// @ts-ignore
export const UnorderedListItem = ({ children, size, ...props }: SizableTextProps) => {
  return (
    <XStack marginVertical="$1">
      <Paragraph {...props} size={size}>{`\u2022`}</Paragraph>
      <Paragraph flex={1} paddingLeft="$4" size={size} {...props}>
        {children}
      </Paragraph>
    </XStack>
  )
}
