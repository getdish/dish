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
    fontSize,
    color,
    backgroundColor,
    subtleIcon,
    hideIcon,
    ...rest
  }: StackProps & {
    rank?: number
    tag: Partial<Tag> & Pick<Tag, 'name' | 'type'>
    size?: 'lg' | 'md'
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
    const scale = size == 'lg' ? 1.05 : 1
    const paddingVertical = (subtle ? 0 : 8) * scale
    const lineHeight = 22 * scale
    const defaultColor = noColor ? 'inherit' : '#777'
    const bg = backgroundColor ?? (subtle ? 'transparent' : defaultColor)
    const fg = color ?? (subtle ? defaultColor : 'white')
    return (
      <HStack
        backgroundColor={bg}
        // borderWidth={1}
        // borderColor={subtle ? 'transparent' : '#ddd'}
        borderRadius={8 * scale}
        overflow="hidden"
        alignItems="center"
        shadowColor={subtle ? 'transparent' : 'rgba(0,0,0,0.15)'}
        shadowRadius={3 * scale}
        shadowOffset={{ width: 0, height: 1 * scale }}
        // spacing="sm"
        position="relative"
        minHeight={lineHeight}
        {...rest}
      >
        {!!rank && (
          <Text
            style={
              {
                fontSize: subtle ? 'inherit' : 13 * scale,
                fontWeight: 'bold',
                paddingVertical: '4%',
                marginVertical: '-2.5%',
                paddingHorizontal: 7 * scale,
                backgroundColor: subtle ? 'transparent' : '#fff',
                lineHeight,
                alignSelf: 'stretch',
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
              fontSize: fontSize ?? (subtle ? 'inherit' : 13 * scale),
              fontWeight: 'inherit',
              lineHeight: 'inherit',
              paddingVertical: paddingVertical,
              paddingHorizontal: subtle ? 0 : 8 * scale,
              color: fg,
              margin: 'auto',
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
              backgroundColor: subtle ? 'transparent' : '#fff',
              height: '100%',
            }}
          >
            <HoverableButton onPress={() => {}}>
              <Icon marginBottom={-1} size={12} name="ChevronUp" />
            </HoverableButton>
            <HoverableButton onPress={() => {}}>
              <Icon size={12} name="ChevronDown" />
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
