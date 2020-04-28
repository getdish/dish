import { Tag } from '@dish/models'
import _ from 'lodash'
import React, { memo } from 'react'
import { Text, TextStyle, View } from 'react-native'

import { Icon } from '../ui/Icon'
import { HStack, StackProps } from '../ui/Stacks'
import { HoverableButton } from './HoverableButton'
import { SuperScriptText } from './SuperScriptText'

export const TagButton = memo(
  ({
    rank,
    tag,
    size,
    subtle,
    noColor,
    closable,
    onClose,
    votable,
    fontSize: fontSizeProp,
    color,
    backgroundColor,
    subtleIcon,
    hideIcon,
    ...rest
  }: StackProps & {
    rank?: number
    tag: Partial<Tag> & Pick<Tag, 'name' | 'type'>
    size?: 'lg' | 'md' | 'sm'
    subtle?: boolean
    votable?: boolean
    closable?: boolean
    onClose?: Function
    color?: any
    hideIcon?: boolean
    subtleIcon?: boolean
    fontSize?: TextStyle['fontSize']
    noColor?: boolean
  }) => {
    const scale = size === 'sm' ? 0.8 : size == 'lg' ? 1.05 : 1
    const paddingVertical = (subtle ? 0 : 6) * scale
    const lineHeight = 22 * scale
    const defaultColor = noColor ? 'inherit' : 'blue'
    const bg = backgroundColor ?? (subtle ? defaultColor : 'white')
    const fg = color ?? (subtle ? 'transparent' : defaultColor)
    const fontSize = fontSizeProp ?? (subtle ? 'inherit' : 13 * scale)
    const rankFontSize =
      typeof fontSize === 'number' ? fontSize * 0.9 : fontSize
    const moveInPx = 3.5 * (1 / scale)
    return (
      <HStack
        height={scale * 28}
        backgroundColor={bg}
        borderRadius={8 * scale}
        overflow="hidden"
        alignItems="center"
        shadowColor={subtle ? 'transparent' : 'rgba(0,0,0,0.15)'}
        shadowRadius={3 * scale}
        shadowOffset={{ width: 0, height: 1 * scale }}
        position="relative"
        minHeight={lineHeight}
        {...rest}
      >
        {!!rank && (
          <Text
            style={
              {
                fontSize: rankFontSize,
                fontWeight: 'bold',
                verticalAlign: 'center',
                margin: 'auto',
                marginVertical: '-2%',
                paddingHorizontal: 7 * scale,
                backgroundColor: subtle
                  ? 'transparent'
                  : 'rgba(255,255,255,0.99)',
                lineHeight,
                alignSelf: 'stretch',
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
              } as any
            }
          >
            <SuperScriptText style={{ opacity: 0.5 }}>#</SuperScriptText>
            {rank}
          </Text>
        )}
        <Text
          numberOfLines={1}
          style={
            {
              fontSize,
              fontWeight: 'inherit',
              lineHeight: 'inherit',
              paddingVertical: paddingVertical,
              paddingHorizontal: subtle ? 0 : 8 * scale,
              color: fg,
              marginVertical: -7,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            } as any
          }
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
          <View
            style={{
              paddingVertical,
              marginLeft: -8 * scale,
              paddingHorizontal: 8 * scale,
              marginTop: size === 'sm' ? -24 : 0,
              backgroundColor: subtle ? 'transparent' : '#fff',
              height: '100%',
            }}
          >
            <HoverableButton
              // marginBottom={-10 + (size === 'sm' ? -10 : 0)}
              onPress={() => {}}
              top={moveInPx}
            >
              <Icon size={9 * scale} name="ChevronUp" />
            </HoverableButton>
            <HoverableButton
              bottom={moveInPx}
              marginTop={-10}
              height={2}
              onPress={() => {}}
            >
              <Icon size={9 * scale} name="ChevronDown" />
            </HoverableButton>
          </View>
        )}
        {!!closable && (
          <HoverableButton
            paddingVertical={paddingVertical}
            backgroundColor={subtle ? 'transparent' : 'transparent'}
            borderRadius={10}
            onPress={onClose}
            opacity={0.3}
            top={-1}
            {...(!subtle && {
              marginLeft: -4,
              marginRight: 6,
            })}
            {...(subtle && {
              position: 'absolute',
              top: -9,
              right: -2,
            })}
            width={16}
            height={16}
            alignItems="center"
            justifyContent="center"
          >
            <Icon
              size={subtle ? 10 : 12}
              name="X"
              color={subtle ? 'inherit' : '#000'}
            />
          </HoverableButton>
        )}
      </HStack>
    )
  }
)
