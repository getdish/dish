// debug
// TODO if we can have compiler pick up a few more things speeds will go up a lot
import { NonNullObject, Tag, TagType } from '@dish/graph'
import { ThumbsDown, ThumbsUp, X } from '@dish/react-feather'
import React, { memo, useState } from 'react'
import { Image } from 'react-native'
import {
  HStack,
  Hoverable,
  Spacer,
  StackProps,
  Text,
  TextProps,
  TextSuperScript,
  VStack,
  prevent,
} from 'snackui'

import {
  blue,
  green,
  lightBlue,
  lightGreen,
  lightOrange,
  lightPurple,
  lightRed,
  orange,
  purple,
  red,
} from '../colors'
import { isWeb } from '../constants'
import { useUserUpvoteDownvoteQuery } from '../hooks/useUserUpvoteDownvoteQuery'
import { getTagId } from '../state/getTagId'
import { tagDisplayName } from '../state/tagDisplayName'
import { LinkButton } from './ui/LinkButton'
import { LinkButtonProps } from './ui/LinkProps'

export type TagButtonTagProps = NonNullObject<
  Required<Pick<Tag, 'name' | 'type'>>
> & {
  icon?: Exclude<Tag['icon'], null>
  rgb?: Exclude<Tag['rgb'], null>
  score?: number
  rank?: number
}

export const getTagButtonProps = (tag: TagButtonTagProps): TagButtonProps => {
  return {
    name: tag.name,
    type: tag.type as TagType,
    icon: tag.icon ?? '',
    rgb: Array.isArray(tag.rgb) ? tag.rgb : tag.rgb?.(),
    rank: tag.rank,
    score: tag.score,
  }
}

const tagColors = {
  country: [lightOrange, orange],
  filter: [lightBlue, blue],
  lense: [lightPurple, purple],
  dish: [lightRed, red],
  other: [lightGreen, green],
}

export const getTagColors = ({ rgb, type }: Partial<Tag>) => {
  if (rgb) {
    return {
      backgroundColor: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`,
      color: '#fff',
    }
  }
  if (type === 'dish') {
    return {
      backgroundColor: '#f2f2f2',
      color: '#000',
    }
  }
  const [backgroundColor, color] = tagColors[type] ?? tagColors.other
  return {
    backgroundColor,
    color,
  }
}

export type TagButtonProps = Omit<StackProps & TagButtonTagProps, 'rgb'> & {
  rgb?: [number, number, number]
  rank?: number
  size?: 'lg' | 'md' | 'sm'
  votable?: boolean
  closable?: boolean
  onClose?: Function
  color?: any
  hideIcon?: boolean
  subtleIcon?: boolean
  fontSize?: TextProps['fontSize']
  fontWeight?: TextProps['fontWeight']
  noColor?: boolean
  replace?: boolean
  replaceSearch?: boolean
  onPress?: Function
  restaurantId?: string
}

export const TagButton = memo((props: TagButtonProps) => {
  const {
    rank,
    name,
    type,
    size,
    noColor,
    closable,
    onClose,
    replaceSearch,
    votable,
    fontSize: fontSizeProp,
    fontWeight,
    color,
    backgroundColor,
    icon,
    rgb,
    score,
    subtleIcon,
    hideIcon,
    replace,
    onPress,
    ...rest
  } = props

  if (name === null) {
    return null
  }
  const tag = { name, type: type as TagType, icon, rgb }
  const scale = size === 'sm' ? 0.85 : size == 'lg' ? 1 : 1

  const colors = getTagColors(tag)
  const bg = backgroundColor ?? colors.backgroundColor
  const fg = color ?? colors.color

  const fontSize = fontSizeProp ? fontSizeProp : 16 * scale

  const smallerFontSize: any =
    typeof fontSize === 'number' ? fontSize * 0.85 : fontSize

  const contents = (
    <>
      <HStack
        className="ease-in-out-faster"
        height={size === 'sm' ? 28 : 34}
        borderRadius={size === 'sm' ? 8 : 10}
        paddingHorizontal={size === 'sm' ? 4 : 10}
        overflow="hidden"
        alignItems="center"
        justifyContent="center"
        backgroundColor={bg}
        position="relative"
        // used again down below
        minHeight={size == 'sm' ? 22 : 26}
        hoverStyle={{
          backgroundColor: `${bg}99`,
        }}
        {...rest}
      >
        {!!rank ? (
          <Text
            fontSize={smallerFontSize}
            fontWeight="500"
            paddingHorizontal={6 * scale}
            alignContent="center"
            justifyContent="center"
            alignItems="center"
            display="flex"
            color={fg}
          >
            <TextSuperScript fontWeight="300" opacity={0.5}>
              #
            </TextSuperScript>
            {rank}
          </Text>
        ) : null}
        {hideIcon ? (
          <>&nbsp;</>
        ) : !!tag.icon ? (
          tag.icon.startsWith('http') ? (
            <Image
              source={{ uri: tag.icon }}
              style={{
                width: fontSize,
                height: fontSize,
                borderRadius: 1000,
                display: isWeb ? ('inline-flex' as any) : 'flex',
                marginVertical: -2,
              }}
            />
          ) : (
            <Text>{tag.icon}</Text>
          )
        ) : null}
        <Text
          ellipse
          // @ts-ignore
          fontSize={fontSize}
          // @ts-ignore
          fontWeight={fontWeight ?? '600'}
          lineHeight={size == 'sm' ? 22 : 26}
          paddingHorizontal={7 * scale}
          color={fg}
        >
          {tagDisplayName(tag)}
          {typeof score === 'number' && (
            <Text marginLeft={4} fontWeight="300" fontSize={smallerFontSize}>
              {score > 0 ? `+${score}` : score}
            </Text>
          )}
        </Text>
        {!!votable && <TagButtonVote {...props} color={fg} scale={scale} />}
        {!!closable && (
          <VStack onPress={prevent} onPressIn={prevent} onPressOut={onClose}>
            <VStack
              backgroundColor="transparent"
              borderRadius={10}
              opacity={0.35}
              marginLeft={-10}
              position="relative"
              width={isWeb ? 26 : 40}
              height={isWeb ? 26 : 40}
              alignItems="center"
              justifyContent="center"
              alignSelf="center"
            >
              <X size={13} color={color} />
            </VStack>
          </VStack>
        )}
        {!closable && !votable && <Spacer size={6} />}
      </HStack>
    </>
  )

  const linkButtonProps: LinkButtonProps = {
    ...(onPress && {
      onPress,
    }),
    ...(tag && {
      tag,
    }),
    replace,
    replaceSearch,
  }

  return (
    <LinkButton disallowDisableWhenActive {...linkButtonProps}>
      {contents}
    </LinkButton>
  )
})

const TagButtonVote = (props: TagButtonProps & { scale: number }) => {
  const { scale } = props
  const [hovered, setHovered] = useState(false)
  const { vote, setVote } = useUserUpvoteDownvoteQuery(
    props.restaurantId ?? '',
    {
      [getTagId(props)]: true,
    }
  )
  const Icon = vote ? ThumbsDown : ThumbsUp
  const color = props.color ?? 'rgba(0,0,0,0.7)'
  const iconProps = {
    size: 12 * scale,
    color,
  }

  return (
    <Hoverable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      <VStack
        paddingHorizontal={3 * scale}
        alignItems="center"
        justifyContent="center"
        borderRadius={100}
        width={24 * scale}
        height={24 * scale}
        marginRight={5 * scale}
        opacity={0.6}
        hoverStyle={{
          opacity: 1,
          transform: [{ scale: 1.2 }],
        }}
        onPressIn={prevent}
        onPress={(e) => {
          prevent(e)
          setVote(vote == 0 ? 1 : vote === -1 ? 0 : -1)
        }}
      >
        {vote === 0 && <Icon {...iconProps} />}
        {vote !== 0 && (
          <VStack
            width={24 * scale}
            height={24 * scale}
            backgroundColor={color}
            borderRadius={100}
            alignItems="center"
            justifyContent="center"
          >
            <Text color="#fff" fontSize={13 * scale} fontWeight="700">
              {vote < 0 ? vote : `+${vote}`}
            </Text>
          </VStack>
        )}
      </VStack>
    </Hoverable>
  )
}
