import React, { memo } from 'react'
import { Text, View } from 'react-native'

import { Icon } from '../shared/Icon'
import { Spacer } from '../shared/Spacer'
import { HStack } from '../shared/Stacks'
import { HoverableButton } from './HoverableButton'
import { SuperScriptText } from './SuperScriptText'
import { Tag } from '@dish/models'

export const TagButton = memo(
  ({
    rank,
    tag,
    size,
    subtle,
    closable,
    onClose,
    votable,
  }: {
    rank?: number
    tag: Partial<Tag> & Pick<Tag, 'name' | 'type'>
    size?: 'lg' | 'md'
    subtle?: boolean
    votable?: boolean
    closable?: boolean
    onClose?: Function
  }) => {
    const scale = size == 'lg' ? 1.05 : 1
    const paddingVertical = 1 * scale
    const lineHeight = 22 * scale
    const color = 'purple'
    const bg = subtle ? 'transparent' : color
    const fg = subtle ? color : 'white'
    return (
      <HStack
        backgroundColor={bg}
        borderWidth={1}
        borderColor={subtle ? 'transparent' : '#ddd'}
        borderRadius={10 * scale}
        // overflow="hidden"
        alignItems="center"
        shadowColor={subtle ? 'transparent' : 'rgba(0,0,0,0.1)'}
        shadowRadius={6 * scale}
        shadowOffset={{ width: 0, height: 2 * scale }}
        spacing="sm"
        position="relative"
      >
        {!!rank && (
          <Text
            style={{
              fontSize: subtle ? 'inherit' : 13 * scale,
              fontWeight: 'bold',
              paddingVertical: '5%',
              marginVertical: '-2.5%',
              paddingHorizontal: 6 * scale,
              backgroundColor: subtle ? 'transparent' : '#fff',
              lineHeight,
              alignSelf: 'stretch',
            }}
          >
            <SuperScriptText style={{ opacity: 0.5 }}>#</SuperScriptText>
            {rank}
          </Text>
        )}
        <Text
          style={{
            fontSize: subtle ? 'inherit' : 13 * scale,
            fontWeight: subtle ? 'inherit' : 'bold',
            paddingVertical,
            // paddingHorizontal: 6 * scale,
            color: fg,
            lineHeight,
            margin: 'auto',
          }}
        >
          <span style={{ marginRight: -4, marginLeft: 4 }}>{tag.icon}</span>
          {tag['displayName'] ?? tag.name}
        </Text>
        {!!votable && (
          <View
            style={{
              paddingVertical,
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
            backgroundColor={subtle ? 'transparent' : '#fff'}
            height="100%"
            onPress={onClose}
            position="absolute"
            top={-9}
            right={-2}
          >
            <Icon size={10} name="x" />
          </HoverableButton>
        )}
      </HStack>
    )
  }
)
