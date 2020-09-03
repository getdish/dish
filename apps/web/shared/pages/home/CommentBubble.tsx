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
  ellipseContentAbove,
  expandable,
  text,
  before,
  after,
  ...rest
}: Omit<StackProps, 'children'> & {
  user: Partial<UserModel>
  text: string
  before?: any
  after?: any
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
      spacing
      {...rest}
    >
      <HStack alignItems="center" spacing={6} flexWrap="nowrap">
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

      {before}

      <Text selectable opacity={0.8} lineHeight={20} fontSize={14}>
        {ellipseContentAbove && text.length > ellipseContentAbove ? (
          <>
            {isExpanded
              ? text
              : typeof text === 'string'
              ? text.slice(0, ellipseContentAbove) + '...'
              : text}{' '}
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
          text
        )}
      </Text>

      {after}
    </VStack>
  )
}
