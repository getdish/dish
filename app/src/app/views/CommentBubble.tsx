import { User } from '@dish/react-feather'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'
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
  useTheme,
} from 'snackui'

import { thirdPartyCrawlSources } from '../../constants/thirdPartyCrawlSources'
import { getColorsForName } from '../../helpers/getColorsForName'
import { getTimeFormat } from '../../helpers/getTimeFormat'
import { getWindowHeight } from '../../helpers/getWindow'
import { ensureFlexText } from '../home/restaurant/ensureFlexText'
import { UserAvatar } from '../home/user/UserAvatar'
import { CloseButton } from './CloseButton'
import { Image } from './Image'
import { Link } from './Link'
import { PaneControlButtons } from './PaneControlButtons'

type CommentBubbleProps = Omit<StackProps, 'children'> & {
  title?: any
  name: string
  avatar?: { charIndex: number; image: string } | null
  text?: any
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
  children?: any
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
      marginBottom={-20}
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
  children,
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
    <>
      {title ? (
        <>
          {title}
          <Spacer />
        </>
      ) : null}
      {!!text && (
        <Paragraph
          className="preserve-whitespace break-word"
          selectable
          maxWidth="100%"
          overflow="hidden"
          sizeLineHeight={0.9}
          size={1}
        >
          {ellipseContentAbove && text && text.length > ellipseContentAbove ? (
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
      )}
      {children}
    </>
  )

  return (
    <VStack
      maxWidth="100%"
      overflow="hidden"
      paddingRight={15}
      paddingLeft={3}
      padding={10}
      width="100%"
      spacing
      pointerEvents="none"
    >
      {before}

      {/* main card */}
      <VStack
        padding={15}
        marginLeft={20}
        backgroundColor={theme.cardBackgroundColor}
        borderRadius={20}
        position="relative"
        zIndex={10}
        shadowColor={theme.shadowColorLighter}
        shadowRadius={8}
        shadowOffset={{ height: 3, width: 0 }}
        height={bubbleHeight}
        pointerEvents="auto"
      >
        {/* tiny bottom left bubble */}
        <AbsoluteVStack
          bottom={-10}
          left={0}
          width={20}
          height={20}
          borderRadius={100}
          backgroundColor={theme.cardBackgroundColor}
          shadowColor={theme.shadowColorLighter}
          shadowRadius={4}
          shadowOffset={{ height: 3, width: -3 }}
        />

        {scrollable ? (
          <ScrollView
            pointerEvents="auto"
            style={{ maxHeight: Math.min(getWindowHeight() * 0.8, 600) }}
          >
            {contents}
          </ScrollView>
        ) : (
          contents
        )}

        {!!(date || belowContent) && (
          <>
            <Spacer size="sm" />
            {belowContent}
          </>
        )}
      </VStack>

      <HStack y={-6} alignItems="center" width={circleSize}>
        <VStack
          borderRadius={100}
          backgroundColor={
            avatarBackgroundColor ?? (isYelp ? thirdPartyCrawlSources.yelp.color : colors.color200)
          }
        >
          {!avatar && <User color={theme.color} size={imageSize} />}
          {!!avatar && (
            <UserAvatar
              charIndex={avatar.charIndex}
              size={imageSize}
              avatar={
                isTripAdvisor
                  ? thirdPartyCrawlSources.tripadvisor.image
                  : isYelp
                  ? thirdPartyCrawlSources.yelp.image
                  : avatar.image
              }
            />
          )}
        </VStack>

        <Spacer size="lg" />

        <HStack alignItems="center" spacing>
          {!!name && (
            <Link
              name="user"
              params={{ username: name }}
              pointerEvents="auto"
              maxWidth="100%"
              flex={1}
              fontSize={13}
              ellipse
            >
              {name}
            </Link>
          )}

          {!!name && <Middot />}

          {!!date && (
            <>
              <Paragraph flexShrink={0} size="sm" opacity={0.5}>
                {getTimeFormat(new Date(date))}
              </Paragraph>
            </>
          )}

          {!!date && <Middot />}

          {after}
        </HStack>
      </HStack>
    </VStack>
  )
}

const Middot = () => (
  <Paragraph opacity={0.5} size="sm">
    &middot;
  </Paragraph>
)
