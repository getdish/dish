import { tagDisplayName } from '../../constants/tagDisplayName'
import { FontSizeTokens, Paragraph, Spacer } from '@dish/ui'
import React from 'react'

export function TagsText({ tags, size }: { tags: any[]; size?: FontSizeTokens }) {
  return (
    <>
      {tags.map((tag, index) => (
        <React.Fragment key={tag.name}>
          {/* {tag.icon ? (
            <Paragraph
              cursor="inherit"
              width="$1.5"
              fontSize={22}
              marginVertical={-2}
              rotateY="-20deg"
            >
              {tag.icon.trim()}{' '}
            </Paragraph>
          ) : null} */}
          {/* {!!tag.icon && <Spacer size="$2" />} */}
          <Paragraph
            color="$color"
            ff="$stylish"
            cursor="inherit"
            size={size}
            fontWeight="500"
          >
            {tagDisplayName(tag)}
          </Paragraph>
          {index < tags.length - 1 ? (
            <Paragraph
              cursor="inherit"
              paddingHorizontal={8}
              fontSize="$5"
              opacity={0.23}
              y={-1}
            >
              +
            </Paragraph>
          ) : null}
        </React.Fragment>
      ))}
    </>
  )
}
