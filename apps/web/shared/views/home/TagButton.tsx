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
    votable,
  }: {
    rank?: number
    tag: Partial<Tag> & Pick<Tag, 'name' | 'type'>
    size?: 'lg' | 'md'
    votable?: boolean
  }) => {
    const scale = size == 'lg' ? 1.05 : 1
    const paddingVertical = 1 * scale
    const lineHeight = 22 * scale
    return (
      <HStack
        backgroundColor="purple"
        borderWidth={1}
        borderColor={'#ddd'}
        borderRadius={10 * scale}
        overflow="hidden"
        alignItems="center"
        shadowColor="rgba(0,0,0,0.1)"
        shadowRadius={6 * scale}
        shadowOffset={{ width: 0, height: 2 * scale }}
      >
        {!!rank && (
          <Text
            style={{
              fontSize: 13 * scale,
              fontWeight: 'bold',
              paddingVertical: '5%',
              marginVertical: '-2.5%',
              paddingHorizontal: 8 * scale,
              backgroundColor: '#fff',
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
            fontSize: 13 * scale,
            fontWeight: 'bold',
            paddingVertical,
            paddingHorizontal: 8 * scale,
            color: '#fff',
            lineHeight,
            margin: 'auto',
          }}
        >
          {tag.icon} {tag.name}
        </Text>
        {!!votable && (
          <>
            <Spacer flex />
            <View
              style={{
                paddingVertical,
                paddingHorizontal: 8 * scale,
                backgroundColor: '#fff',
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
          </>
        )}
      </HStack>
    )
  }
)
