import { User } from '@dish/react-feather'
import { Circle, HStack, StackProps, Text, VStack } from '@dish/ui'
import React, { useState } from 'react'

import { bgLight } from '../colors'
import { Link } from './ui/Link'

export const CommentBubble = ({
  name,
  ellipseContentAbove,
  expandable,
  text,
  before,
  after,
  ...rest
}: Omit<StackProps, 'children'> & {
  name?: string
  text?: string
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
      spacing="sm"
      {...rest}
    >
      {!!name && (
        <HStack width="100%" maxWidth="100%" alignItems="center">
          <Circle size={18} marginRight={4} marginTop={2}>
            <User color="#999" size={12} />
          </Circle>
          <HStack maxWidth="90%" marginBottom={-3}>
            <Link
              ellipse
              backgroundColor={bgLight}
              borderRadius={100}
              paddingHorizontal={8}
              paddingVertical={5}
              name="user"
              params={{ username: name }}
              fontWeight="600"
              color="#222"
            >
              {name}
            </Link>
          </HStack>
        </HStack>
      )}

      <VStack width="100%" spacing>
        {before}

        {!!text && (
          <Text
            className="preserve-whitespace"
            selectable
            opacity={0.8}
            lineHeight={20}
            fontSize={14}
          >
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
        )}

        {after}
      </VStack>
    </VStack>
  )
}
