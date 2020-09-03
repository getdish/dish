import { User as UserModel } from '@dish/graph'
import {
  Circle,
  HStack,
  StackProps,
  Text,
  VStack,
  useScrollPosition,
} from '@dish/ui'
import React, { useState } from 'react'
import { User } from 'react-feather'

import { Link } from '../../views/ui/Link'

export const CommentBubble = ({
  user,
  children,
  ellipseContentAbove,
  expandable,
  ...rest
}: StackProps & {
  user: Partial<UserModel>
  children: any
  ellipseContentAbove?: number
  expandable?: boolean
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
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

      <Text selectable opacity={0.8} lineHeight={20} fontSize={14}>
        {ellipseContentAbove && children.length > ellipseContentAbove ? (
          <>
            {isExpanded
              ? children
              : typeof children === 'string'
              ? children.slice(0, ellipseContentAbove) + '...'
              : children}{' '}
            {!!expandable && (
              <Link
                onClick={() => {
                  setIsExpanded((x) => !x)
                }}
              >
                {isExpanded ? <>&laquo; Less</> : <>Read more &raquo;</>}
              </Link>
            )}
          </>
        ) : (
          children
        )}
      </Text>
    </VStack>
  )
}
