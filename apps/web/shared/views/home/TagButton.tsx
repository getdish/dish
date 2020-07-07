import { NonNullObject, Tag, TagType } from '@dish/graph'
import {
  HStack,
  Spacer,
  StackProps,
  SuperScriptText,
  Text,
  TextProps,
  VStack,
  prevent,
} from '@dish/ui'
import _ from 'lodash'
import React, { memo } from 'react'
import { ChevronUp, ThumbsUp, X } from 'react-feather'

import { LinkButton } from '../ui/LinkButton'
import { bg, bgLight } from './colors'

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
  noColor?: boolean
  replace?: boolean
  onPress?: Function
}

export const TagButton = memo(
  ({
    rank,
    name,
    type,
    size,
    subtle,
    noColor,
    closable,
    onClose,
    votable,
    fontSize: fontSizeProp,
    color,
    icon,
    rgb,
    subtleIcon,
    hideIcon,
    replace,
    onPress,
    ...rest
  }: TagButtonProps) => {
    if (name === null) {
      return null
    }
    const tag = { name, type: type as TagType, icon, rgb }
    const scale = size === 'sm' ? 0.85 : size == 'lg' ? 1 : 1
    const height = scale * (subtle ? 26 : 30)
    const lineHeight = 22 * scale
    const defaultColor = noColor ? 'inherit' : getTagColor(rgb)
    const fg = color ?? (subtle ? 'rgba(0,0,0,0.65)' : defaultColor)
    const fontSize = fontSizeProp ?? (subtle ? 'inherit' : 16 * scale)
    const rankFontSize =
      typeof fontSize === 'number' ? fontSize * 0.9 : fontSize
    // const moveInPx = size === 'sm' ? 0 : 3.5 * (1 / scale)

    const contents = (
      <>
        <HStack
          height={height}
          borderColor={subtle ? 'transparent' : 'rgba(0,0,0,0.1)'}
          borderWidth={1}
          borderRadius={6 * scale}
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
              fontWeight="bold"
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
            <Spacer size={scale * 5} />
          )}
          <Text
            ellipse
            // @ts-ignore
            fontSize={fontSize}
            // @ts-ignore
            fontWeight={size == 'lg' ? '500' : 'inherit'}
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
                  ...(subtle && { marginLeft: 4 }),
                  ...(subtleIcon && {
                    fontSize: '90%',
                    marginTop: '-2px',
                    marginBottom: '-2px',
                    marginRight: 8,
                  }),
                }}
              >
                {tag.icon}
              </span>
            ) : null}
            {tag['displayName'] ?? _.capitalize(tag.name)}
          </Text>
          {!!votable && (
            <LinkButton
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
              opacity={0.5}
              hoverStyle={{
                opacity: 1,
              }}
              onPressOut={(e) => {
                prevent(e)
                console.warn('should vote')
              }}
            >
              <ThumbsUp
                size={12 * scale}
                color={subtle ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.7)'}
              />
            </LinkButton>
          )}
          {!!closable && (
            <VStack
              backgroundColor={subtle ? 'transparent' : 'transparent'}
              borderRadius={10}
              onPressIn={prevent}
              onPressOut={onClose}
              opacity={0.5}
              {...(!subtle && {
                marginLeft: -8,
                marginRight: 2,
              })}
              position="relative"
              top="1px"
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
                size={subtle ? 12 : 14}
                style={{
                  color: subtle ? 'inherit' : color,
                }}
              />
            </VStack>
          )}
        </HStack>
      </>
    )

    if (onPress) {
      return (
        <LinkButton onPress={onPress} replace={replace}>
          {contents}
        </LinkButton>
      )
    }

    return (
      <LinkButton tag={tag} disabledIfActive replace={replace}>
        {contents}
      </LinkButton>
    )
  }
)
