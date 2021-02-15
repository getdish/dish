import React from 'react'
import { Text } from 'snackui'

import { tagDisplayName } from '../../constants/tagMeta'

export function TagsText({ tags, color }: { tags: any[]; color?: string }) {
  return (
    <>
      {tags.map((tag, index) => (
        <React.Fragment key={tag.name}>
          {tag.icon ? (
            <Text
              marginRight={6}
              fontSize={20}
              lineHeight={20}
              transform={[{ translateY: 0.5 }]}
            >
              {tag.icon.trim()}{' '}
            </Text>
          ) : null}
          <Text color={color} fontSize={16} fontWeight="400">
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
