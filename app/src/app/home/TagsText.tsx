import { tagDisplayName } from '../../constants/tagDisplayName'
import { Paragraph, Spacer } from '@dish/ui'
import React from 'react'

export function TagsText({ tags }: { tags: any[] }) {
  return (
    <>
      {tags.map((tag, index) => (
        <React.Fragment key={tag.name}>
          {tag.icon ? (
            <Paragraph width={20} marginVertical={-2} rotateY="-20deg">
              {tag.icon.trim()}{' '}
            </Paragraph>
          ) : null}
          {!!tag.icon && <Spacer size="$2" />}
          <Paragraph fontSize={13} fontWeight="500">
            {tagDisplayName(tag)}
          </Paragraph>
          {index < tags.length - 1 ? (
            <Paragraph paddingHorizontal={8} fontSize={12} opacity={0.23} y={-1}>
              +
            </Paragraph>
          ) : null}
        </React.Fragment>
      ))}
    </>
  )
}
