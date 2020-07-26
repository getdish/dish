import { NonNullObject, Tag, TagType } from '@dish/graph'
import {
  HStack,
  Spacer,
  StackProps,
  SuperScriptText,
  Text,
  TextProps,
  VStack,
  getNode,
  prevent,
} from '@dish/ui'
import _ from 'lodash'
import React, { memo, useEffect, useRef } from 'react'
import { ThumbsUp, X } from 'react-feather'
import { Image, View } from 'react-native'

import { bgLight } from '../../colors'
import { getTagId, tagDisplayNames } from '../../state/Tag'
import { LinkButton } from '../../views/ui/LinkButton'
import { LinkButtonProps } from '../../views/ui/LinkProps'
import { useUserUpvoteDownvote } from './useUserReview'

export type TagButtonTagProps = NonNullObject<
  Required<Pick<Tag, 'name' | 'type'>>
> & {
  icon?: Exclude<Tag['icon'], null>
  rgb?: Exclude<Tag['rgb'], null>
}

export const getTagButtonProps = (tag: TagButtonTagProps): TagButtonProps => {
  return {
    name: tag.name,
    type: tag.type as TagType,
    icon: tag.icon ?? '',
    rgb: Array.isArray(tag.rgb) ? tag.rgb : tag.rgb?.(),
  }
}

export const getTagColor = (rgb?: [number, number, number]): string =>
  rgb ? `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` : 'inherit'

export type TagButtonProps = Omit<StackProps & TagButtonTagProps, 'rgb'> & {
  rgb?: [number, number, number]
  rank?: number
  size?: 'lg' | 'md' | 'sm'
  subtle?: boolean
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
    subtle,
    noColor,
    closable,
    onClose,
    replaceSearch,
    votable,
    fontSize: fontSizeProp,
    fontWeight,
    color,
    icon,
    rgb,
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
  const height = scale * (subtle ? 26 : 32)
  const lineHeight = 22 * scale
  const defaultColor = noColor ? 'inherit' : getTagColor(rgb)
  const fg = color ?? (subtle ? 'rgba(0,0,0,0.65)' : defaultColor)
  const fontSize = fontSizeProp ?? (subtle ? 'inherit' : 16 * scale)
  const rankFontSize = typeof fontSize === 'number' ? fontSize * 0.9 : fontSize
  // const moveInPx = size === 'sm' ? 0 : 3.5 * (1 / scale)

  const contents = (
    <>
      <HStack
        height={height}
        borderColor={subtle ? 'transparent' : 'rgba(0,0,0,0.1)'}
        borderWidth={1}
        borderRadius={8 * scale}
        overflow="hidden"
        alignItems="center"
        justifyContent="center"
        position="relative"
        minHeight={lineHeight}
        hoverStyle={{
          backgroundColor: bgLight,
        }}
        {...(!subtle && {
          hoverStyle: {
            transform: [{ rotate: '-2deg', scale: 1.1 }],
          },
        })}
        {...rest}
      >
        {rank ? (
          <Text
            // @ts-ignore
            fontSize={rankFontSize}
            fontWeight="600"
            margin="auto"
            marginVertical="-2%"
            paddingHorizontal={8 * scale}
            backgroundColor={subtle ? 'transparent' : 'rgba(0,0,0,0.05)'}
            lineHeight={lineHeight}
            alignSelf="stretch"
            alignContent="center"
            justifyContent="center"
            alignItems="center"
            display="flex"
          >
            <SuperScriptText opacity={0.5}>#</SuperScriptText>
            {rank}
          </Text>
        ) : (
          <Spacer size={scale * 2} />
        )}
        <Text
          ellipse
          // @ts-ignore
          fontSize={fontSize}
          // @ts-ignore
          fontWeight={fontWeight ?? (size == 'lg' ? '500' : 'inherit')}
          // @ts-ignore
          lineHeight="inherit"
          paddingHorizontal={subtle ? 0 : 7 * scale}
          color={fg}
          marginVertical={-7}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {hideIcon ? (
            <>&nbsp;</>
          ) : !!tag.icon ? (
            <span
              style={{
                marginRight: 5,
                ...(subtle && { marginLeft: 4 }),
                ...(subtleIcon && {
                  fontSize: '90%',
                  marginTop: '-2px',
                  marginBottom: '-2px',
                  marginRight: 8,
                }),
              }}
            >
              {tag.icon.startsWith('http') ? (
                <Image
                  source={{ uri: tag.icon }}
                  style={{
                    width: fontSize,
                    height: fontSize,
                    borderRadius: 1000,
                    display: 'inline-flex' as any,
                    marginRight: 8,
                    marginVertical: -2,
                  }}
                />
              ) : (
                `${tag.icon}`
              )}
            </span>
          ) : null}
          {tagDisplayNames[tag.name] ?? _.capitalize(tag.name)}
        </Text>
        {!!votable && (
          //
          <TagButtonVote {...props} scale={scale} />
        )}
        {!!closable && (
          <VStack
            backgroundColor={subtle ? 'transparent' : 'transparent'}
            borderRadius={10}
            onPressIn={prevent}
            onPressOut={onClose}
            opacity={0.35}
            {...(!subtle && {
              marginLeft: -10,
            })}
            position="relative"
            {...(subtle && {
              position: 'absolute',
              top: -9,
              right: -2,
            })}
            width={26}
            height={26}
            alignItems="center"
            justifyContent="center"
            alignSelf="center"
          >
            <X
              size={subtle ? 11 : 13}
              style={{
                color: subtle ? 'inherit' : color,
              }}
            />
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
  const { scale, subtle } = props
  const [vote, setVote] = useUserUpvoteDownvote(props.restaurantId, {
    [getTagId(props)]: true,
  })
  const buttonRef = useRef()

  // only way i could get it to stop bubbling up wtf
  useEffect(() => {
    const node = getNode(buttonRef?.current)
    node.addEventListener('click', prevent)
    return () => {
      node.removeEventListener('click', prevent)
    }
  }, [])

  return (
    <VStack
      // @ts-ignore
      ref={buttonRef}
      paddingHorizontal={5 * scale}
      alignItems="center"
      justifyContent="center"
      borderRadius={100}
      width={24 * scale}
      height={24 * scale}
      {...(subtle && {
        marginLeft: 4,
        overflow: 'hidden',
      })}
      opacity={subtle ? 0.1 : 0.6}
      hoverStyle={{
        opacity: 1,
      }}
      onPressIn={prevent}
      onPress={(e) => {
        prevent(e)
        setVote(vote == 1 ? 0 : 1)
      }}
    >
      <ThumbsUp
        size={12 * scale}
        color={subtle ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.7)'}
      />
    </VStack>
  )
}
