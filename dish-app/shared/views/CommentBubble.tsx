import { User } from '@dish/react-feather'
import { Circle, HStack, Paragraph, StackProps, Text, VStack } from '@dish/ui'
import React, { useState } from 'react'
import { Image } from 'react-native'

import { bgLight } from '../colors'
import { ensureFlexText } from '../pages/restaurant/ensureFlexText'
import { thirdPartyCrawlSources } from '../thirdPartyCrawlSources'
import { Link } from './ui/Link'

export const CommentBubble = ({
  name,
  ellipseContentAbove,
  expandable,
  text,
  before,
  after,
  afterName,
  ...rest
}: Omit<StackProps, 'children'> & {
  name?: string
  text?: string
  before?: any
  after?: any
  ellipseContentAbove?: number
  afterName?: any
  expandable?: boolean
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const isTripAdvisor = name.startsWith('tripadvisor-')
  const isYelp = name.startsWith('yelp-')

  if (isTripAdvisor) {
    name = name.replace('tripadvisor-', '')
  }
  if (isYelp) {
    name = name.replace('yelp-', '')
  }

  return (
    <VStack
      borderRadius={10}
      padding={4}
      alignItems="flex-start"
      justifyContent="flex-start"
      spacing="sm"
      maxWidth="100%"
      {...rest}
    >
      {!!name && (
        <HStack width="100%" maxWidth="100%" alignItems="center">
          <Circle
            size={26}
            marginRight={4}
            marginVertical={-4}
            marginBottom={-6}
          >
            {isTripAdvisor ? (
              <Image
                source={{ uri: thirdPartyCrawlSources.tripadvisor.image }}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 100,
                }}
              />
            ) : isYelp ? (
              <Image
                source={{ uri: thirdPartyCrawlSources.yelp.image }}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 100,
                }}
              />
            ) : (
              <User color="#999" size={16} />
            )}
          </Circle>
          <HStack
            flex={1}
            alignItems="center"
            maxWidth="100%"
            marginBottom={-3}
          >
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
            {afterName}
          </HStack>
        </HStack>
      )}

      {ensureFlexText}

      <VStack maxWidth="100%" width="100%" spacing>
        {before}

        {!!text && (
          <Paragraph
            className="preserve-whitespace"
            selectable
            opacity={0.8}
            size={1.1}
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
          </Paragraph>
        )}

        {after}
      </VStack>
    </VStack>
  )
}
