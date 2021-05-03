import React from 'react'
import { Spacer, Text } from 'snackui'

import { tagDisplayName } from '../../constants/tagDisplayName'

export function TagsText({ tags, color }: { tags: any[]; color?: string }) {
  return (
    <>
      {tags.map((tag, index) => (
        <React.Fragment key={tag.name}>
          {tag.icon ? (
            <Text
              marginLeft={-1}
              width={24}
              fontSize={20}
              lineHeight={20}
              transform={[{ translateY: 1 }]}
            >
              {tag.icon.trim()}{' '}
            </Text>
          ) : null}
          <Spacer size="sm" />
          <Text color={color} fontSize={16} fontWeight="600">
            {tagDisplayName(tag)}
          </Text>
          {index < tags.length - 1 ? (
            <Text
              paddingHorizontal={8}
              fontSize={12}
              opacity={0.23}
              transform={[{ translateY: -3 }]}
            >
              +
            </Text>
          ) : null}
        </React.Fragment>
      ))}
    </>
  )
}
