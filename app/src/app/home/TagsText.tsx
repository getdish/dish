import React from 'react'
import { Spacer, Text } from 'snackui'

import { tagDisplayName } from '../../constants/tagDisplayName'

export function TagsText({ tags, color }: { tags: any[]; color?: string }) {
  return (
    <>
      {tags.map((tag, index) => (
        <React.Fragment key={tag.name}>
          {tag.icon ? (
            <Text width={20} fontSize={16} scale={1} lineHeight={20} y={1} rotateY="-20deg">
              {tag.icon.trim()}{' '}
            </Text>
          ) : null}
          <Spacer size="sm" />
          <Text color={color} fontSize={15} fontWeight="400">
            {tagDisplayName(tag)}
          </Text>
          {index < tags.length - 1 ? (
            <Text paddingHorizontal={8} fontSize={12} opacity={0.23} y={-1}>
              +
            </Text>
          ) : null}
        </React.Fragment>
      ))}
    </>
  )
}
