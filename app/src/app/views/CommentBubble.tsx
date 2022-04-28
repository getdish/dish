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
import {
  AbsoluteYStack,
  Modal,
  Paragraph,
  Spacer,
  Text,
  XStack,
  YStack,
  YStackProps,
  useTheme,
} from '@dish/ui'
import { User } from '@tamagui/feather-icons'
import React, { useState } from 'react'
import { ScrollView } from 'react-native'

export type CommentBubbleProps = Omit<YStackProps, 'children'> & {
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

  return null

  return (
    <YStack
      borderRadius={10}
      padding={4}
      alignItems="flex-start"
      justifyContent="flex-start"
      space="$2"
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
          <YStack paddingTop={20} maxWidth="100%" flex={1} overflow="hidden">
            <CommentBubbleContents {...props} scrollable expanded />
          </YStack>
        </Modal>
      )}

      <CommentBubbleContents {...props} onExpand={() => setIsExpanded(true)} expanded={false} />
    </YStack>
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
          color={color ? color : '$colorHover'}
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

  const externalSource = source && source !== 'dish' ? thirdPartyCrawlSources[source] : null
  const backgroundColor = avatarBackgroundColor || '$grey10'
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
    <XStack alignItems="center" pointerEvents="auto">
      {hideMeta ? (
        <YStack flex={1} />
      ) : (
        <>
          <XStack space="$2" alignItems="center">
            <YStack
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
                  {!avatar && <User color={theme.color.toString()} size={charSize} />}
                  {!!avatar && (
                    <UserAvatar
                      charIndex={avatarProp?.charIndex || 0}
                      size={circleSize}
                      avatar={avatar}
                    />
                  )}
                </>
              )}
            </YStack>
            {!!externalSource?.image && (
              <YStack
                shadowColor="$shadowColor"
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
              </YStack>
            )}
          </XStack>

          <Spacer size="$4" />

          <XStack flex={1} pointerEvents="auto" alignItems="center" space>
            {!!name && (
              <YStack>
                {wrapLink(
                  <Text color="$color" fontSize={size === 'lg' ? 18 : 14} fontWeight="800">
                    {isExternalUser ? `via ${externalSource?.name || '-'}` : name}
                  </Text>
                )}
              </YStack>
            )}

            {!!name && <Middot />}

            {!!date && (
              <>
                <Paragraph flexShrink={0} size="$3" opacity={0.5}>
                  {getTimeFormat(new Date(date))}
                </Paragraph>
              </>
            )}
          </XStack>
        </>
      )}

      {after}
    </XStack>
  )

  return (
    <YStack
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
        <YStack
          paddingHorizontal={15}
          paddingVertical={15}
          marginLeft={20}
          backgroundColor="$backgroundCard"
          borderColor="$borderColor"
          borderWidth={0.5}
          borderRadius={20}
          position="relative"
          zIndex={10}
          shadowColor="$shadowColorHover"
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
            <AbsoluteYStack
              theme="Card"
              bottom={-6}
              left={0}
              width={20}
              height={20}
              borderRadius={100}
              backgroundColor="$background"
              shadowColor="$shadowColorHover"
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
        </YStack>
      )}

      {metaContents}
    </YStack>
  )
}
