import { User } from '@dish/react-feather'
import React, { useState } from 'react'
import { Image } from 'react-native'
import {
  AbsoluteVStack,
  Circle,
  HStack,
  Paragraph,
  Spacer,
  StackProps,
  Text,
  VStack,
} from 'snackui'

import { bgLight } from '../../constants/colors'
import { getColorsForName } from '../../helpers/getColorsForName'
import { ensureFlexText } from '../home/restaurant/ensureFlexText'
import { thirdPartyCrawlSources } from '../../constants/thirdPartyCrawlSources'
import { Link } from './Link'

export const CommentBubble = ({
  name,
  avatar,
  ellipseContentAbove,
  bubbleHeight,
  expandable,
  text,
  before,
  after,
  afterName,
  fullWidth,
  ...rest
}: Omit<StackProps, 'children'> & {
  name: string
  avatar: string
  text: any
  before?: any
  after?: any
  ellipseContentAbove?: number
  fullWidth?: boolean
  afterName?: any
  bubbleHeight?: number
  expandable?: boolean
}) => {
  const colors = getColorsForName(`hi${name}`)
  const [isExpanded, setIsExpanded] = useState(false)
  const isTripAdvisor = name?.startsWith('tripadvisor-')
  const isYelp = name?.startsWith('yelp-')
  if (isTripAdvisor) {
    name = name?.replace('tripadvisor-', '')
  }
  if (isYelp) {
    name = name?.replace('yelp-', '').replace(/[_-].*/, '')
  }

  const circleSize = 80
  const imageSize = circleSize * 0.6

  return (
    <VStack
      borderRadius={10}
      padding={4}
      alignItems="flex-start"
      justifyContent="flex-start"
      spacing="sm"
      overflow="hidden"
      margin={-10}
      {...rest}
    >
      {fullWidth && ensureFlexText}

      <VStack
        maxWidth="100%"
        overflow="hidden"
        padding={10}
        width="100%"
        spacing
      >
        {before}

        <VStack
          padding={10}
          marginBottom={-30}
          marginLeft={20}
          backgroundColor="#fff"
          borderRadius={20}
          position="relative"
          zIndex={10}
          shadowColor="rgba(0,0,0,0.1)"
          shadowRadius={10}
          shadowOffset={{ height: 3, width: 0 }}
          height={bubbleHeight}
        >
          {/* little bubble */}
          <AbsoluteVStack
            bottom={-10}
            left={0}
            width={20}
            height={20}
            borderRadius={100}
            backgroundColor="#fff"
            shadowColor="rgba(0,0,0,0.2)"
            shadowRadius={4}
            shadowOffset={{ height: 3, width: -3 }}
          />
          <Paragraph
            className="preserve-whitespace"
            selectable
            maxWidth="100%"
            overflow="hidden"
            sizeLineHeight={0.85}
            size={1}
          >
            {ellipseContentAbove && text.length > ellipseContentAbove ? (
              <Text>
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
                    {isExpanded ? (
                      <Text>&laquo; Less</Text>
                    ) : (
                      <Text>Read more &raquo;</Text>
                    )}
                  </Link>
                )}
              </Text>
            ) : (
              text
            )}
          </Paragraph>
        </VStack>

        <HStack>
          <VStack alignItems="center" width={circleSize}>
            <VStack marginBottom={-10}>
              <Circle backgroundColor={colors.color} size={circleSize}>
                {isTripAdvisor ? (
                  <Image
                    source={{ uri: thirdPartyCrawlSources.tripadvisor.image }}
                    style={{
                      width: imageSize,
                      height: imageSize,
                      borderRadius: 100,
                    }}
                  />
                ) : isYelp ? (
                  <Image
                    source={{ uri: thirdPartyCrawlSources.yelp.image }}
                    style={{
                      width: imageSize,
                      height: imageSize,
                      borderRadius: 100,
                    }}
                  />
                ) : (
                  <User color="#fff" size={imageSize} />
                )}
              </Circle>
            </VStack>

            <HStack
              backgroundColor={colors.altColor}
              borderRadius={10}
              paddingHorizontal={5}
              paddingVertical={3}
              position="relative"
              overflow="hidden"
              maxWidth={90}
              zIndex={2}
            >
              <Link
                ellipse
                flex={1}
                name="user"
                params={{ username: name }}
                fontWeight="400"
                fontSize={13}
                maxWidth="100%"
                color="#fff"
              >
                {name}
              </Link>
              {afterName}
            </HStack>
          </VStack>
          <Spacer size="lg" />
          {after}
        </HStack>
      </VStack>
    </VStack>
  )
}
