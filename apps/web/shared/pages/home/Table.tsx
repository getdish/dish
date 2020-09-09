import { HStack, StackProps, Text, TextProps, VStack } from '@dish/ui'
import React from 'react'

export const Table = (props: StackProps) => <VStack {...props} />

export const TableRow = (props: StackProps) => (
  <HStack alignSelf="stretch" flex={1} {...props} />
)

export const TableCell = (props: StackProps) => (
  <HStack
    alignSelf="stretch"
    flex={1}
    padding={4}
    alignItems="center"
    {...props}
  />
)

export const TableHeadRow = (props: StackProps) => (
  <HStack
    alignSelf="stretch"
    flex={1}
    borderBottomColor="#eee"
    borderBottomWidth={1}
    {...props}
  />
)

export const TableHeadText = (props: TextProps) => (
  <Text
    backgroundColor="#eee"
    padding={2}
    paddingHorizontal={8}
    marginLeft={-8}
    borderRadius={10}
    maxWidth={52}
    ellipse
    fontSize={12}
    {...props}
  />
)
