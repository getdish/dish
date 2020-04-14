import { Tag } from '@dish/models'
import React, { memo } from 'react'
import { Text, TextStyle, View } from 'react-native'

import { Icon } from '../ui/Icon'
import { HStack, StackBaseProps } from '../ui/Stacks'
import { HoverableButton } from './HoverableButton'
import { SuperScriptText } from './SuperScriptText'

export const TagButton = memo(
  ({
    rank,
    tag,
    size,
    subtle,
    closable,
    onClose,
    votable,
    fontSize,
    color,
    backgroundColor,
    subtleIcon,
    hideIcon,
    ...rest
  }: StackBaseProps & {
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
  }) => {
    const scale = size == 'lg' ? 1.05 : 1
    const paddingVertical = 1.33 * scale
    const lineHeight = 22 * scale
    const defaultColor = 'purple'
    const bg = backgroundColor ?? (subtle ? 'transparent' : defaultColor)
    const fg = color ?? (subtle ? defaultColor : 'white')
    return (
      <HStack
        backgroundColor={bg}
        borderWidth={1}
        borderColor={subtle ? 'transparent' : '#ddd'}
        borderRadius={10 * scale}
        // overflow="hidden"
        alignItems="center"
        shadowColor={subtle ? 'transparent' : 'rgba(0,0,0,0.05)'}
        shadowRadius={4 * scale}
        shadowOffset={{ width: 0, height: 2 * scale }}
        // spacing="sm"
        position="relative"
        {...rest}
      >
        {!!rank && (
          <Text
            style={
              {
                fontSize: subtle ? 'inherit' : 13 * scale,
                fontWeight: 'bold',
                paddingVertical: '5%',
                marginVertical: '-2.5%',
                paddingHorizontal: 6 * scale,
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
              paddingVertical: subtle ? 0 : paddingVertical,
              paddingHorizontal: subtle ? 0 : 8 * scale,
              color: fg,
              margin: 'auto',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            } as any
          }
        >
          {!hideIcon && (
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
          {tag['displayName'] ?? tag.name}
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
              <Icon marginBottom={-1} size={12} name="chevron-up" />
            </HoverableButton>
            <HoverableButton onPress={() => {}}>
              <Icon size={12} name="chevron-down" />
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
              name="x"
              color={subtle ? 'inherit' : '#000'}
            />
          </HoverableButton>
        )}
      </HStack>
    )
  }
)
