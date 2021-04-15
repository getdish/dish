import { User } from '@dish/react-feather'
import React, { useState } from 'react'
import { Image, ScrollView } from 'react-native'
import { Theme } from 'snackui'
import { useTheme } from 'snackui'
import {
  AbsoluteVStack,
  Circle,
  HStack,
  Modal,
  Paragraph,
  Spacer,
  StackProps,
  Text,
  VStack,
} from 'snackui'

import { thirdPartyCrawlSources } from '../../constants/thirdPartyCrawlSources'
import { getColorsForName } from '../../helpers/getColorsForName'
import { getTimeFormat } from '../../helpers/getTimeFormat'
import { getWindowHeight } from '../../helpers/getWindow'
import { ensureFlexText } from '../home/restaurant/ensureFlexText'
import { CloseButton } from './CloseButton'
import { Link } from './Link'
import { PaneControlButtons } from './PaneControlButtons'

type CommentBubbleProps = Omit<StackProps, 'children'> & {
  title?: any
  name: string
  avatar: string | any
  text: any
  before?: any
  avatarBackgroundColor?: string
  after?: any
  ellipseContentAbove?: number
  fullWidth?: boolean
  afterName?: any
  bubbleHeight?: number
  expandable?: boolean
  date?: Date
  belowContent?: any
}

export const CommentBubble = (props: CommentBubbleProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const {
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
    date,
    ...rest
  } = props

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

      {isExpanded && (
        <Modal
          overlayDismisses
          visible
          width="98%"
          maxWidth={800}
          maxHeight="90%"
          onDismiss={() => setIsExpanded(false)}
        >
          <PaneControlButtons>
            <CloseButton onPress={() => setIsExpanded(false)} />
          </PaneControlButtons>
          <VStack paddingTop={20} maxWidth="100%" flex={1} overflow="hidden">
            <CommentBubbleContents {...props} scrollable expanded />
          </VStack>
        </Modal>
      )}

      <CommentBubbleContents {...props} onExpand={() => setIsExpanded(true)} expanded={false} />
    </VStack>
  )
}

function CommentBubbleContents({
  title,
  name,
  avatar,
  ellipseContentAbove,
  bubbleHeight,
  expandable,
  text,
  before,
  after,
  afterName,
  date,
  onExpand,
  expanded,
  belowContent,
  avatarBackgroundColor,
  scrollable,
}: CommentBubbleProps & {
  onExpand?: () => any
  expanded?: boolean
  scrollable?: boolean
}) {
  const theme = useTheme()
  const isTripAdvisor = name?.startsWith('tripadvisor-')
  const isYelp = name?.startsWith('Yelp')
  if (isTripAdvisor) {
    name = name?.replace('tripadvisor-', '')
  }
  if (isYelp) {
    name = name?.replace('yelp-', '').replace(/[_-].*/, '')
  }
  const circleSize = 65
  const imageSize = circleSize * 0.6
  const colors = getColorsForName(`${name}`)

  const contents = (
    <VStack>
      {title ? (
        <>
          {title}
          <Spacer />
        </>
      ) : null}
      <Paragraph
        className="preserve-whitespace break-word"
        selectable
        maxWidth="100%"
        overflow="hidden"
        sizeLineHeight={0.85}
        size={1}
      >
        {ellipseContentAbove && text.length > ellipseContentAbove ? (
          <Text>
            {expanded
              ? text
              : typeof text === 'string'
              ? text.slice(0, ellipseContentAbove) + '...'
              : text}{' '}
            {!expanded && !!expandable && (
              <Link onPress={onExpand}>
                <Text>Read more &raquo;</Text>
              </Link>
            )}
          </Text>
        ) : (
          text
        )}
      </Paragraph>
    </VStack>
  )

  return (
    <VStack
      maxWidth="100%"
      overflow="hidden"
      paddingHorizontal={15}
      padding={10}
      width="100%"
      spacing
    >
      {before}

      <VStack
        padding={15}
        marginBottom={-30}
        marginLeft={20}
        backgroundColor={theme.cardBackgroundColor}
        borderRadius={20}
        position="relative"
        zIndex={10}
        shadowColor="rgba(0,0,0,0.075)"
        shadowRadius={8}
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
          backgroundColor={theme.cardBackgroundColor}
          shadowColor="rgba(0,0,0,0.2)"
          shadowRadius={4}
          shadowOffset={{ height: 3, width: -3 }}
        />

        {scrollable ? (
          <ScrollView style={{ maxHeight: Math.min(getWindowHeight() * 0.8, 600) }}>
            {contents}
          </ScrollView>
        ) : (
          contents
        )}

        {!!(date || belowContent) && (
          <>
            <Spacer size="sm" />
            <HStack>
              {!!date && (
                <>
                  <Paragraph opacity={0.5}>{getTimeFormat(new Date(date))}</Paragraph>
                  <Spacer size="sm" />
                </>
              )}
              {belowContent}
            </HStack>
          </>
        )}
      </VStack>

      <HStack>
        <VStack alignItems="center" width={circleSize}>
          <VStack marginBottom={-10}>
            <Circle
              backgroundColor={
                avatarBackgroundColor ??
                (isYelp ? thirdPartyCrawlSources.yelp.color : colors.pastelColor)
              }
              size={circleSize}
            >
              <VStack borderRadius={100} overflow="hidden">
                {isTripAdvisor ? (
                  <Image
                    source={{ uri: thirdPartyCrawlSources.tripadvisor.image }}
                    style={{
                      width: imageSize,
                      height: imageSize,
                      margin: -1,
                    }}
                  />
                ) : isYelp ? (
                  <Image
                    source={{ uri: thirdPartyCrawlSources.yelp.image }}
                    style={{
                      width: imageSize,
                      height: imageSize,
                      margin: -1,
                    }}
                  />
                ) : typeof avatar === 'string' ? (
                  <Image
                    source={{ uri: avatar }}
                    style={{
                      width: imageSize,
                      height: imageSize,
                      margin: -1,
                    }}
                  />
                ) : !!avatar ? (
                  avatar
                ) : (
                  <User color="#fff" size={imageSize} />
                )}
              </VStack>
            </Circle>
          </VStack>

          <HStack
            backgroundColor={colors.darkColor}
            borderRadius={10}
            paddingHorizontal={5}
            paddingVertical={3}
            position="relative"
            overflow="hidden"
            maxWidth={90}
            zIndex={2}
          >
            <Link
              name="user"
              params={{ username: name }}
              color="#fff"
              maxWidth="100%"
              flex={1}
              fontSize={13}
            >
              <Text ellipse>{name}</Text>
            </Link>
            {afterName}
          </HStack>
        </VStack>
        <Spacer size="lg" />
        {after}
      </HStack>
    </VStack>
  )
}
