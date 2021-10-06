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

import { grey } from '../../constants/colors'
import { thirdPartyCrawlSources } from '../../constants/thirdPartyCrawlSources'
import { getTimeFormat } from '../../helpers/getTimeFormat'
import { getWindowHeight } from '../../helpers/getWindow'
import { ensureFlexText } from '../home/restaurant/ensureFlexText'
import { UserAvatar } from '../home/user/UserAvatar'
import { CloseButton } from './CloseButton'
import { Image } from './Image'
import { Link } from './Link'
import { Middot } from './Middot'
import { PaneControlButtons } from './PaneControlButtons'

export type CommentBubbleProps = Omit<StackProps, 'children'> & {
  name: string
  username: string | undefined | null
  title?: any
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
  children?: any
  chromeless?: boolean
  hideMeta?: boolean
  source?: string
  showChildren?: boolean
  size?: 'lg' | 'md'
  color?: string
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
      {...rest}
    >
      {fullWidth && ensureFlexText}

      {isExpanded && (
        <Modal
          overlayDismisses
          visible
          width="98%"
          maxWidth={760}
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

function CommentBubbleContents(
  props: CommentBubbleProps & {
    onExpand?: () => any
    expanded?: boolean
    scrollable?: boolean
  }
) {
  const {
    title,
    name,
    username,
    avatar: avatarProp,
    ellipseContentAbove,
    bubbleHeight,
    expandable,
    text,
    before,
    hideMeta,
    after,
    afterName,
    chromeless,
    date,
    onExpand,
    expanded,
    size,
    // belowContent,
    source,
    avatarBackgroundColor,
    scrollable,
    showChildren,
    children,
    color,
  } = props
  const theme = useTheme()
  const canExpand = !expanded && !!expandable

  const hasContents = !!text || showChildren
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
          maxWidth="100%"
          overflow="hidden"
          color={color ? color : theme.colorSecondary}
          fontSize={size === 'lg' ? 18 : 14}
          lineHeight={size === 'lg' ? 32 : 18}
        >
          {ellipseContentAbove && text && text.length > ellipseContentAbove ? (
            <Text selectable>
              {expanded
                ? text
                : typeof text === 'string'
                ? text.replace(/\s+/g, ' ').slice(0, ellipseContentAbove) + '...'
                : text}{' '}
              {canExpand && (
                <Link underline={false} onPress={onExpand}>
                  <Paragraph fontWeight="700">Read &raquo;</Paragraph>
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

  const circleSize = size === 'lg' ? 52 : 44
  const extImgSize = size === 'lg' ? 44 : 38
  const charSize = 22
  // const colors = getColorsForName(`${name}`)

  const externalSource = source && source !== 'dish' ? thirdPartyCrawlSources[source] : null
  const backgroundColor = avatarBackgroundColor || grey
  const avatar = avatarProp?.image || ''
  const isExternalUser = name === '_dish_external_user'

  const wrapLink = (children: any) => {
    return (
      <Link name="user" params={{ username: username || '' }} pointerEvents="auto" ellipse>
        {children}
      </Link>
    )
  }

  const metaContents = (
    <HStack alignItems="center" pointerEvents="auto">
      {hideMeta ? (
        <VStack flex={1} />
      ) : (
        <>
          <HStack spacing="sm" alignItems="center">
            <VStack
              width={circleSize}
              height={circleSize}
              marginVertical={size === 'lg' ? -4 : 0}
              borderRadius={100}
              backgroundColor={backgroundColor}
              alignItems="center"
              justifyContent="center"
            >
              {wrapLink(
                <>
                  {!avatar && <User color={theme.color} size={charSize} />}
                  {!!avatar && (
                    <UserAvatar
                      charIndex={avatarProp?.charIndex || 0}
                      size={circleSize}
                      avatar={avatar}
                    />
                  )}
                </>
              )}
            </VStack>
            {!!externalSource?.image && (
              <VStack
                shadowColor={theme.shadowColor}
                shadowRadius={4}
                shadowOffset={{ height: 2, width: 0 }}
                borderRadius={1000}
                overflow="hidden"
                zIndex={-1}
                position="relative"
                width={extImgSize}
                height={extImgSize}
              >
                <Image
                  source={{ uri: externalSource.image }}
                  style={{ width: extImgSize, height: extImgSize }}
                />
              </VStack>
            )}
          </HStack>

          <Spacer size="lg" />

          <HStack flex={1} pointerEvents="auto" alignItems="center" spacing>
            {!!name && (
              <VStack>
                {wrapLink(
                  <Text color={theme.color} fontSize={size === 'lg' ? 18 : 14} fontWeight="800">
                    {isExternalUser ? `via ${externalSource?.name || '-'}` : name}
                  </Text>
                )}
              </VStack>
            )}

            {!!name && <Middot />}

            {!!date && (
              <>
                <Paragraph flexShrink={0} size="sm" opacity={0.5}>
                  {getTimeFormat(new Date(date))}
                </Paragraph>
              </>
            )}
          </HStack>
        </>
      )}

      {after}
    </HStack>
  )

  return (
    <VStack
      maxWidth="100%"
      overflow="hidden"
      paddingRight={15}
      paddingLeft={3}
      padding={10}
      width="100%"
      pointerEvents="none"
    >
      {before}

      {/* {chromeless && metaContents} */}

      {/* main card */}
      {hasContents && (
        <VStack
          paddingHorizontal={15}
          paddingVertical={15}
          marginLeft={20}
          backgroundColor={theme.cardBackgroundColor}
          borderColor={theme.borderColor}
          borderWidth={0.5}
          borderRadius={20}
          position="relative"
          zIndex={10}
          shadowColor={theme.shadowColorLighter}
          shadowRadius={8}
          shadowOffset={{ height: 3, width: 0 }}
          height={bubbleHeight}
          pointerEvents="auto"
          {...(chromeless && {
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
            marginLeft: 0,
            paddingBottom: 10,
            borderColor: 'transparent',
            backgroundColor: 'transparent',
            shadowColor: 'transparent',
          })}
        >
          {/* tiny bottom left bubble */}
          {!chromeless && (
            <AbsoluteVStack
              bottom={-6}
              left={0}
              width={20}
              height={20}
              borderRadius={100}
              backgroundColor={theme.cardBackgroundColor}
              shadowColor={theme.shadowColorLighter}
              shadowRadius={4}
              shadowOffset={{ height: 3, width: 0 }}
            />
          )}

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
        </VStack>
      )}

      {metaContents}
    </VStack>
  )
}
