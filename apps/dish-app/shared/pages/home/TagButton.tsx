import { NonNullObject, Tag, TagType } from '@dish/graph'
import { ThumbsUp, X } from '@dish/react-feather'
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
import React, { memo, useEffect, useRef } from 'react'
import { Image } from 'react-native'

import { getTagId } from '../../state/getTagId'
import { tagDisplayName } from '../../state/tagDisplayName'
import { LinkButton } from '../../views/ui/LinkButton'
import { LinkButtonProps } from '../../views/ui/LinkProps'
import { useUserUpvoteDownvoteQuery } from './useUserReview'

export type TagButtonTagProps = NonNullObject<
  Required<Pick<Tag, 'name' | 'type'>>
> & {
  icon?: Exclude<Tag['icon'], null>
  rgb?: Exclude<Tag['rgb'], null>
  rank?: number
}

export const getTagButtonProps = (tag: TagButtonTagProps): TagButtonProps => {
  return {
    name: tag.name,
    type: tag.type as TagType,
    icon: tag.icon ?? '',
    rgb: Array.isArray(tag.rgb) ? tag.rgb : tag.rgb?.(),
  }
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
  const backgroundColor =
    type === 'country'
      ? // orange
        '#BD5C16'
      : type === 'filter'
      ? // blue
        '#164ABD'
      : type === 'lense'
      ? // purple
        '#6C16BD'
      : type === 'dish'
      ? // red
        '#BD1616'
      : // green
        '#777'
  return {
    backgroundColor,
    color: '#fff',
  }
}

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
    backgroundColor,
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

  let bg = 'transparent'
  let fg = '#444'

  if (!subtle) {
    const colors = getTagColors(tag)
    bg = backgroundColor ?? colors.backgroundColor
    fg = color ?? colors.color
  }

  const fontSize = fontSizeProp ?? (subtle ? 'inherit' : 16 * scale)
  // const moveInPx = size === 'sm' ? 0 : 3.5 * (1 / scale)

  const smallerFontSize =
    typeof fontSize === 'number' ? fontSize * 0.85 : fontSize

  const contents = (
    <>
      <HStack
        height={height}
        borderRadius={10 * scale}
        overflow="hidden"
        alignItems="center"
        justifyContent="center"
        backgroundColor={bg}
        position="relative"
        minHeight={lineHeight}
        // hoverStyle={{
        //   transform: [{ scale: 1.05 }],
        // }}
        {...(!subtle && {
          hoverStyle: {
            transform: [{ rotate: '-2deg', scale: 1.1 }],
          },
        })}
        {...rest}
      >
        {!!rank ? (
          <Text
            // @ts-ignore
            fontSize={smallerFontSize}
            margin="auto"
            paddingHorizontal={6 * scale}
            alignSelf="stretch"
            alignContent="center"
            justifyContent="center"
            alignItems="center"
            display="flex"
            color={fg}
          >
            <SuperScriptText opacity={0.5}>#</SuperScriptText>
            {rank}
          </Text>
        ) : null}
        {/* tag name */}
        <Text
          ellipse
          // @ts-ignore
          fontSize={fontSize}
          // @ts-ignore
          fontWeight={fontWeight ?? subtle ? 'inherit' : '600'}
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
            <Text
              marginRight={5}
              {...(subtle && { marginLeft: 4 })}
              {...(subtleIcon && {
                fontSize: smallerFontSize as any,
                marginTop: '-2px',
                marginBottom: '-2px',
                marginRight: 8,
              })}
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
            </Text>
          ) : null}
          {/* // tagDisplayNames[tag.name] ?? _.capitalize(tag.name) */}
          {tagDisplayName(tag)}
        </Text>
        {!!votable && (
          //
          <TagButtonVote {...props} color={fg} scale={scale} />
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
  const [vote, setVote] = useUserUpvoteDownvoteQuery(props.restaurantId ?? '', {
    [getTagId(props)]: true,
  })
  const buttonRef = useRef()

  // only way i could get it to stop bubbling up wtf
  useEffect(() => {
    const node = getNode(buttonRef?.current)
    node?.addEventListener('click', prevent)
    return () => {
      node?.removeEventListener('click', prevent)
    }
  }, [])

  return (
    <VStack
      // @ts-ignore
      ref={buttonRef}
      paddingHorizontal={3 * scale}
      alignItems="center"
      justifyContent="center"
      borderRadius={100}
      width={24 * scale}
      height={24 * scale}
      marginRight={5 * scale}
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
        color={props.color ?? (subtle ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.7)')}
      />
    </VStack>
  )
}
