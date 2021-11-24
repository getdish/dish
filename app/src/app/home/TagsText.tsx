import { Spacer, Text, useTheme } from '@dish/ui'
import React from 'react'

import { tagDisplayName } from '../../constants/tagDisplayName'

export function TagsText({ tags }: { tags: any[] }) {
  const theme = useTheme()
  return (
    <>
      {tags.map((tag, index) => (
        <React.Fragment key={tag.name}>
          {tag.icon ? (
            <Text
              width={20}
              fontSize={16}
              marginVertical={-2}
              scale={1}
              lineHeight={20}
              rotateY="-20deg"
            >
              {tag.icon.trim()}{' '}
            </Text>
          ) : null}
          {!!tag.icon && <Spacer size="$2" />}
          <Text color={theme.color} fontSize={13} fontWeight="500">
            {tagDisplayName(tag)}
          </Text>
          {index < tags.length - 1 ? (
            <Text color={theme.color} paddingHorizontal={8} fontSize={12} opacity={0.23} y={-1}>
              +
            </Text>
          ) : null}
        </React.Fragment>
      ))}
    </>
  )
}
