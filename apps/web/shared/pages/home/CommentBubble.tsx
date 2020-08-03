import { User as UserModel } from '@dish/graph'
import { Circle, HStack, StackProps, Text, VStack } from '@dish/ui'
import React from 'react'
import { User } from 'react-feather'

import { Link } from '../../views/ui/Link'

export const CommentBubble = ({
  user,
  children,
  ...rest
}: StackProps & {
  user: Partial<UserModel>
  children: any
}) => {
  return (
    <VStack
      flex={1}
      borderRadius={10}
      padding={4}
      alignItems="flex-start"
      justifyContent="flex-start"
      {...rest}
    >
      <HStack
        alignItems="center"
        spacing={6}
        flexWrap="nowrap"
        marginBottom={10}
      >
        <Circle size={18} marginBottom={-2}>
          <User color="#000" size={12} />
        </Circle>
        <Text selectable color="#999" fontSize={13}>
          <Link
            name="user"
            params={{ username: user.username }}
            fontWeight="600"
            color="#666"
          >
            {user.username}
          </Link>
          &nbsp; says
        </Text>
      </HStack>
      {children}
    </VStack>
  )
}
