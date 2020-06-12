import { NonNullObject, Tag, TagType } from '@dish/graph'
import {
  HStack,
  StackProps,
  SuperScriptText,
  Text,
  TextProps,
  VStack,
} from '@dish/ui'
import _ from 'lodash'
import React, { memo } from 'react'
import { ChevronUp, X } from 'react-feather'

import { LinkButton } from '../ui/LinkButton'

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
    backgroundColor,
    subtleIcon,
    hideIcon,
    replace,
    onPress,
    hoverStyle,
    ...rest
  }: TagButtonProps) => {
    if (name === null) {
      return null
    }
    const tag = { name, type: type as TagType, icon, rgb }
    const scale = size === 'sm' ? 0.85 : size == 'lg' ? 1 : 1
    const paddingVertical = (subtle ? 0 : 6) * scale
    const lineHeight = 22 * scale
    const defaultColor = noColor ? 'inherit' : getTagColor(rgb)
    const bg = backgroundColor ?? (subtle ? defaultColor : 'white')
    const fg = color ?? (subtle ? 'rgba(0,0,0,0.6)' : defaultColor)
    const fontSize = fontSizeProp ?? (subtle ? 'inherit' : 16 * scale)
    const rankFontSize =
      typeof fontSize === 'number' ? fontSize * 0.9 : fontSize
    // const moveInPx = size === 'sm' ? 0 : 3.5 * (1 / scale)

    const contents = (
      <>
        <HStack
          className="ease-in-out-fast"
          height={scale * 31}
          backgroundColor={bg}
          borderRadius={9 * scale}
          borderWidth={1}
          borderColor={subtle ? 'transparent' : 'rgba(0,0,0,0.15)'}
          overflow="hidden"
          alignItems="center"
          justifyContent="center"
          position="relative"
          minHeight={lineHeight}
          {...(!subtle && {
            hoverStyle: {
              // TODO WHY SCALE NOT WORKING???
              transform: [{ rotate: '-2deg', scale: 1.1 }],
              ...hoverStyle,
            },
          })}
          {...rest}
        >
          {!!rank && (
            <Text
              // @ts-ignore
              fontSize={rankFontSize}
              fontWeight="bold"
              margin="auto"
              marginVertical="-2%"
              paddingHorizontal={6 * scale}
              backgroundColor={
                subtle ? 'transparent' : 'rgba(255,255,255,0.99)'
              }
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
          )}
          <Text
            ellipse
            // @ts-ignore
            fontSize={fontSize}
            // @ts-ignore
            fontWeight={size == 'lg' ? '500' : 'inherit'}
            // @ts-ignore
            lineHeight="inherit"
            paddingVertical={paddingVertical}
            paddingHorizontal={subtle ? 0 : 7 * scale}
            color={fg}
            marginVertical={-7}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {hideIcon ? (
              <>&nbsp;</>
            ) : (
              <span
                style={{
                  ...(subtle && { marginLeft: 4 }),
                  ...(subtleIcon && {
                    fontSize: '90%',
                    marginTop: '-2px',
                    marginBottom: '-2px',
                  }),
                }}
              >
                {tag.icon}
              </span>
            )}
            {tag['displayName'] ?? _.capitalize(tag.name)}
          </Text>
          {!!votable && (
            <VStack
              // paddingVertical={paddingVertical}
              // marginLeft={-8 * scale}
              // marginTop={size === 'sm' ? -24 : 0}
              backgroundColor={subtle ? 'transparent' : '#fff'}
              // borderLeftColor="#eee"
              // borderLeftWidth={1}
            >
              <LinkButton
                paddingHorizontal={5 * scale}
                alignItems="center"
                justifyContent="center"
                {...(subtle && {
                  borderRadius: 100,
                  width: 24 * scale,
                  height: 24 * scale,
                  marginLeft: 4,
                  overflow: 'hidden',
                })}
                hoverStyle={{
                  backgroundColor: '#eee',
                }}
                onPress={(e) => {
                  alert('SHOULD VOTE')
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <ChevronUp size={14 * scale} />
              </LinkButton>
            </VStack>
          )}
          {!!closable && (
            <LinkButton
              paddingVertical={paddingVertical}
              backgroundColor={subtle ? 'transparent' : 'transparent'}
              borderRadius={10}
              onPress={onClose}
              opacity={0.5}
              tag={tag}
              {...(!subtle && {
                marginLeft: -4,
                marginRight: 6,
              })}
              position="relative"
              top="8%"
              {...(subtle && {
                position: 'absolute',
                top: -9,
                right: -2,
              })}
              width={16}
              height={16}
              maxHeight={16}
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
            </LinkButton>
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
